import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Physics & Game Constants ---
const GRAVITY = 0.04;
const THRUST_POWER = 0.12;
const ROTATION_SPEED = 3.5;
const MAX_LANDING_SPEED_V = 1.5;
const MAX_LANDING_SPEED_H = 1.5;
const MAX_LANDING_ANGLE = 8; // degrees
const PARTICLE_COUNT = 20;
const INITIAL_FUEL = 1000;

type GameState = 'idle' | 'playing' | 'landed' | 'crashed';

// --- Mock Audio Assets ---
// FIX: Corrected mock audio method signatures to have no arguments, resolving a type error.
const thrusterSound = { play: (): void => {}, pause: (): void => {}, currentTime: 0 };
const explosionSound = { play: (): void => {} };


const ScrollSpaceship: React.FC = () => {
    // State for React rendering (UI, modals)
    const [isGameActive, setIsGameActive] = useState(false);
    const [visualGameState, setVisualGameState] = useState<GameState>('idle');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [hudData, setHudData] = useState({ fuel: INITIAL_FUEL, vSpd: 0, hSpd: 0, angle: 0 });
    const [crashPosition, setCrashPosition] = useState({ x: 0, y: 0 });

    // Refs for high-frequency game state (physics, input, loop control)
    const gameState = useRef<GameState>('idle');
    const position = useRef({ x: window.innerWidth / 2, y: 80 });
    const velocity = useRef({ x: 0, y: 0 });
    const angle = useRef(0);
    const fuel = useRef(INITIAL_FUEL);
    const keysPressed = useRef<{ [key: string]: boolean }>({}).current;
    
    // FIX: Changed useRef to include a null initial value to satisfy TypeScript's expectation of an argument for this specific configuration.
    const gameLoopRef = useRef<number | null>(null);
    const shipRef = useRef<HTMLDivElement>(null);

    // Load high score from local storage once on mount
    useEffect(() => {
        const storedHighScore = localStorage.getItem('landerHighScore');
        if (storedHighScore) {
            setHighScore(parseInt(storedHighScore, 10));
        }
    }, []);

    const endGame = useCallback((): void => {
        setIsGameActive(false);
        gameState.current = 'idle';
        setVisualGameState('idle');
        thrusterSound.pause();
    }, []);

    const resetGame = useCallback(() => {
        position.current = { x: window.innerWidth / 2, y: 80 };
        velocity.current = { x: Math.random() * 2 - 1, y: 0 };
        angle.current = Math.random() * 40 - 20;
        fuel.current = INITIAL_FUEL;
        setScore(0);
        gameState.current = 'playing';
        setVisualGameState('playing');
    }, []);

    const startGame = useCallback(() => {
        setIsGameActive(true);
        resetGame();
    }, [resetGame]);

    // Keyboard listeners
    useEffect(() => {
        if (!isGameActive) return;
        const handleKeyDown = (e: KeyboardEvent) => { keysPressed[e.code] = true; };
        const handleKeyUp = (e: KeyboardEvent) => { keysPressed[e.code] = false; };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isGameActive, keysPressed]);

    // Main Game Loop Effect
    useEffect(() => {
        const loop = () => {
            if (gameState.current !== 'playing') {
                return;
            }

            // --- Physics Calculations ---
            velocity.current.y += GRAVITY;
            const isThrusting = (keysPressed['ArrowUp'] || keysPressed['KeyW']) && fuel.current > 0;
            const isStabilizing = keysPressed['KeyS'] && fuel.current > 0;

            if (isThrusting) {
                const angleRad = (angle.current - 90) * (Math.PI / 180);
                velocity.current.x += Math.cos(angleRad) * THRUST_POWER;
                velocity.current.y += Math.sin(angleRad) * THRUST_POWER;
                fuel.current = Math.max(0, fuel.current - 1);
                if (thrusterSound.currentTime === 0 || thrusterSound.currentTime > 0.4) thrusterSound.play();
            } else {
                thrusterSound.pause();
            }

            if (keysPressed['ArrowLeft'] || keysPressed['KeyA']) angle.current -= ROTATION_SPEED;
            if (keysPressed['ArrowRight'] || keysPressed['KeyD']) angle.current += ROTATION_SPEED;
            
            if (isStabilizing) {
                velocity.current.x *= 0.95;
                angle.current *= 0.95;
                fuel.current = Math.max(0, fuel.current - 0.5);
            }

            position.current.x += velocity.current.x;
            position.current.y += velocity.current.y;

            // --- Direct DOM Update ---
            if (shipRef.current) {
                shipRef.current.style.transform = `translate(-50%, -50%) rotate(${angle.current}deg)`;
                shipRef.current.style.left = `${position.current.x}px`;
                shipRef.current.style.top = `${position.current.y}px`;
            }

            // --- Collision & Landing Check (Optimized) ---
            const ship = shipRef.current;
            if (ship && position.current.y > window.innerHeight * 0.7) { // Only check when near the bottom
                const landingPad = document.getElementById('landing-pad');
                if (landingPad) {
                    const padRect = landingPad.getBoundingClientRect();
                    const shipRect = ship.getBoundingClientRect();

                    if (shipRect.bottom >= padRect.top && shipRect.right >= padRect.left && shipRect.left <= padRect.right) {
                        const normalizedAngle = Math.abs(angle.current % 360);
                        const finalAngle = normalizedAngle > 180 ? 360 - normalizedAngle : normalizedAngle;
                        const isAngleOk = finalAngle <= MAX_LANDING_ANGLE;
                        const isSpeedOk = Math.abs(velocity.current.y) < MAX_LANDING_SPEED_V && Math.abs(velocity.current.x) < MAX_LANDING_SPEED_H;

                        if (isSpeedOk && isAngleOk) {
                            gameState.current = 'landed';
                            setVisualGameState('landed');
                            const speedBonusV = (MAX_LANDING_SPEED_V - Math.abs(velocity.current.y)) * 200;
                            const speedBonusH = (MAX_LANDING_SPEED_H - Math.abs(velocity.current.x)) * 200;
                            const angleBonus = (MAX_LANDING_ANGLE - finalAngle) * 100;
                            const totalScore = Math.round(speedBonusV + speedBonusH + angleBonus + fuel.current);
                            setScore(totalScore);
                            if (totalScore > highScore) {
                                setHighScore(totalScore);
                                localStorage.setItem('landerHighScore', totalScore.toString());
                            }
                        } else {
                            setCrashPosition({ ...position.current });
                            gameState.current = 'crashed';
                            setVisualGameState('crashed');
                            explosionSound.play();
                        }
                        thrusterSound.pause();
                        return; // Exit loop
                    }
                }
            }
            
            // --- Out of bounds check ---
            if (position.current.y > window.innerHeight + 100 || position.current.x < -100 || position.current.x > window.innerWidth + 100) {
                setCrashPosition({ ...position.current });
                gameState.current = 'crashed';
                setVisualGameState('crashed');
                explosionSound.play();
                thrusterSound.pause();
                return; // Exit loop
            }

            gameLoopRef.current = requestAnimationFrame(loop);
        };
        
        if (isGameActive && gameState.current === 'playing') {
            gameLoopRef.current = requestAnimationFrame(loop);
        }

        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
            thrusterSound.pause();
        };
    }, [isGameActive, highScore, keysPressed, resetGame]);

    // HUD Update Loop (low frequency)
    useEffect(() => {
        // FIX: Used window.setInterval to ensure browser-specific types are used,
        // resolving the "Type 'Timeout' is not assignable to type 'number'" error.
        // Also improved cleanup logic.
        if (isGameActive && visualGameState === 'playing') {
            const intervalId = window.setInterval(() => {
                setHudData({
                    fuel: fuel.current,
                    vSpd: velocity.current.y,
                    hSpd: velocity.current.x,
                    angle: angle.current
                });
            }, 100);

            return () => window.clearInterval(intervalId);
        }
    }, [isGameActive, visualGameState]);

    const isThrustingForRender = (keysPressed['ArrowUp'] || keysPressed['KeyW']) && hudData.fuel > 0 && visualGameState === 'playing';
    const finalAngleForHUD = Math.abs(hudData.angle % 360);
    const isAngleOkForHUD = finalAngleForHUD <= MAX_LANDING_ANGLE || finalAngleForHUD >= (360 - MAX_LANDING_ANGLE);

    return (
        <>
            <button
                id="game-activate-button"
                onClick={startGame}
                style={{ display: isGameActive ? 'none' : 'flex' }}
                aria-label="Ativar modo jogo lunar lander"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
            </button>
            
            {isGameActive && (
                <>
                    <div
                        id="spaceship-container"
                        ref={shipRef}
                        style={{
                            left: `${position.current.x}px`,
                            top: `${position.current.y}px`,
                            transform: `translate(-50%, -50%) rotate(${angle.current}deg)`,
                            visibility: visualGameState === 'playing' ? 'visible' : 'hidden',
                        }}
                    >
                        <svg viewBox="0 0 38 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 0L38 42L33 53H5L0 42L19 0Z" fill="#D9D9D9"/>
                            <path d="M5 42L10 53H28L33 42H5Z" fill="#A6A6A6"/>
                            <path d="M12 37L15 42H23L26 37H12Z" fill="#595959"/>
                            {isThrustingForRender && <path id="spaceship-flame" d="M15 53L19 65L23 53H15Z" fill="#FFC700"/>}
                        </svg>
                    </div>
                    
                    {visualGameState === 'crashed' && (
                        <div
                            className="explosion"
                            style={{
                                position: 'fixed', left: crashPosition.x, top: crashPosition.y, transform: 'translate(-50%, -50%)', zIndex: 10001,
                            }}
                        >
                            {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
                                <div key={i} className="particle" style={{ '--i': i } as React.CSSProperties} />
                            ))}
                        </div>
                    )}

                    {visualGameState === 'playing' && (
                        <>
                             <div id="spaceship-hud">
                                <p>FUEL: <span style={{color: hudData.fuel < 200 ? '#f87171' : '#4ade80'}}>{Math.round(hudData.fuel)}</span></p>
                                <p>V-SPD: <span style={{color: Math.abs(hudData.vSpd) > MAX_LANDING_SPEED_V ? '#f87171' : '#4ade80'}}>{hudData.vSpd.toFixed(2)}</span></p>
                                <p>H-SPD: <span style={{color: Math.abs(hudData.hSpd) > MAX_LANDING_SPEED_H ? '#f87171' : '#4ade80'}}>{hudData.hSpd.toFixed(2)}</span></p>
                                <p>ANGLE: <span style={{color: !isAngleOkForHUD ? '#f87171' : '#4ade80'}}>{Math.round(hudData.angle % 360)}°</span></p>
                            </div>
                            <div id="spaceship-instructions">
                                <p><strong>W / ↑:</strong> Acelerar</p>
                                <p><strong>A / ←:</strong> Girar Esq.</p>
                                <p><strong>D / →:</strong> Girar Dir.</p>
                                <p><strong>S:</strong> Estabilizar</p>
                            </div>
                        </>
                    )}
                    
                    {(visualGameState === 'landed' || visualGameState === 'crashed') && (
                        <div id="game-over-modal" onClick={endGame}>
                            <div onClick={(e) => e.stopPropagation()}>
                                <h2 className={`text-4xl font-black mb-4 ${visualGameState === 'landed' ? 'text-green-400' : 'text-red-400'}`}>
                                    {visualGameState === 'landed' ? 'Pouso Bem Sucedido!' : 'Missão Falhou!'}
                                </h2>
                                {visualGameState === 'landed' && (
                                    <div className="text-white text-lg space-y-2 mb-6">
                                        <p>Pontuação: <span className="font-bold text-[#c4b5fd]">{score}</span></p>
                                        <p>Recorde: <span className="font-bold text-yellow-400">{highScore}</span></p>
                                    </div>
                                )}
                                <div className="flex justify-center gap-4 mt-8">
                                    <button
                                        onClick={resetGame}
                                        className="bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90"
                                    >
                                        Jogar Novamente
                                    </button>
                                    <button
                                        onClick={endGame}
                                        className="bg-white/10 text-white font-semibold py-2 px-6 rounded-lg hover:bg-white/20"
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default ScrollSpaceship;
