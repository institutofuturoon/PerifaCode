import React, { useState, useEffect, useRef } from 'react';

// --- Physics & Game Constants ---
const GRAVITY = 0.04;
const THRUST_POWER = 0.12;
const ROTATION_SPEED = 3.5;
const MAX_LANDING_SPEED_V = 1.5;
const MAX_LANDING_SPEED_H = 1.5;
const MAX_LANDING_ANGLE = 8; // degrees
const PARTICLE_COUNT = 20;

// --- Helper Components ---
const HUD: React.FC<{ velY: number, velX: number, angle: number, status: string }> = ({ velY, velX, angle, status }) => (
    <div id="spaceship-hud">
        <p>VEL-V: <span style={{ color: Math.abs(velY) > MAX_LANDING_SPEED_V ? '#ff4747' : '#00ff00' }}>{velY.toFixed(2)}</span></p>
        <p>VEL-H: <span style={{ color: Math.abs(velX) > MAX_LANDING_SPEED_H ? '#ff4747' : '#00ff00' }}>{velX.toFixed(2)}</span></p>
        <p>ANGLE: <span style={{ color: Math.abs(angle % 360) > MAX_LANDING_ANGLE ? '#ff4747' : '#00ff00' }}>{Math.round(angle)}°</span></p>
        {status === 'landed' && <p style={{ color: '#00ffaa' }}>POUSO BEM-SUCEDIDO</p>}
        {status === 'crashed' && <p style={{ color: '#ff4747' }}>NAVE DESTRUÍDA</p>}
    </div>
);

const Instructions: React.FC = () => (
    <div id="spaceship-instructions">
        <p>A/D ou ←/→ : Girar</p>
        <p>W/↑/Espaço : Propulsor</p>
        <p>R: Reiniciar</p>
    </div>
);

const Explosion: React.FC = () => (
    <div className="explosion">
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => <div key={i} className="particle" style={{ '--i': i + 1 } as React.CSSProperties} />)}
    </div>
);

const ScrollSpaceship: React.FC = () => {
    const [gameState, setGameState] = useState<'playing' | 'landed' | 'crashed'>('playing');
    const [position, setPosition] = useState({ x: 100, y: 50 });
    const [velocity, setVelocity] = useState({ x: 0.5, y: 0 });
    const [angle, setAngle] = useState(0);
    const [isThrusting, setIsThrusting] = useState(false);
    const keysPressed = useRef<{ [key: string]: boolean }>({});
    const gameLoopRef = useRef<number>();

    const resetGame = () => {
        setPosition({ x: Math.random() * (window.innerWidth - 200) + 100, y: 50 });
        setVelocity({ x: 0.5, y: 0 });
        setAngle(0);
        setIsThrusting(false);
        setGameState('playing');
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent default browser actions for game keys (scrolling, etc.)
            if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }
            keysPressed.current[e.key.toLowerCase()] = true;
            if (e.key.toLowerCase() === 'r') {
                resetGame();
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            keysPressed.current[e.key.toLowerCase()] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        const gameLoop = () => {
            if (gameState !== 'playing') {
                cancelAnimationFrame(gameLoopRef.current!);
                return;
            }

            let newAngle = angle;
            if (keysPressed.current['arrowleft'] || keysPressed.current['a']) newAngle -= ROTATION_SPEED;
            if (keysPressed.current['arrowright'] || keysPressed.current['d']) newAngle += ROTATION_SPEED;
            
            const thrustOn = keysPressed.current['arrowup'] || keysPressed.current[' '] || keysPressed.current['w'];
            
            let newVel = { ...velocity };
            newVel.y += GRAVITY;
            if (thrustOn) {
                const angleInRadians = (newAngle - 90) * (Math.PI / 180);
                newVel.x += Math.cos(angleInRadians) * THRUST_POWER;
                newVel.y += Math.sin(angleInRadians) * THRUST_POWER;
            }
            
            let newPos = {
                x: position.x + newVel.x,
                y: position.y + newVel.y,
            };

            if (newPos.x < -30) newPos.x = window.innerWidth + 30;
            if (newPos.x > window.innerWidth + 30) newPos.x = -30;
            if (newPos.y < -30) {
                newPos.y = -30;
                newVel.y = Math.abs(newVel.y) * 0.5;
            }

            const landingPad = document.getElementById('landing-pad');
            if (landingPad) {
                const shipRect = { x: newPos.x, y: newPos.y, width: 40, height: 40 }; // Simplified collision box
                const padRect = landingPad.getBoundingClientRect();

                if (
                    shipRect.y + shipRect.height > padRect.top &&
                    shipRect.y < padRect.bottom &&
                    shipRect.x + shipRect.width > padRect.left &&
                    shipRect.x < padRect.right
                ) {
                    const finalAngle = Math.abs(newAngle % 360);
                    const safeAngle = finalAngle < MAX_LANDING_ANGLE || finalAngle > 360 - MAX_LANDING_ANGLE;
                    
                    if (
                        Math.abs(velocity.y) < MAX_LANDING_SPEED_V &&
                        Math.abs(velocity.x) < MAX_LANDING_SPEED_H &&
                        safeAngle
                    ) {
                        setGameState('landed');
                    } else {
                        setGameState('crashed');
                    }
                }
            }
            
            setAngle(newAngle);
            setVelocity(newVel);
            setPosition(newPos);
            setIsThrusting(thrustOn);
            
            gameLoopRef.current = requestAnimationFrame(gameLoop);
        };

        if (gameState === 'playing') {
            gameLoopRef.current = requestAnimationFrame(gameLoop);
        }
        
        return () => {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        };
    }, [gameState, angle, velocity, position]);

    const getShipStyle = (): React.CSSProperties => {
        if (gameState === 'playing') {
            return {
                transform: `translate(${position.x}px, ${position.y}px) rotate(${angle}deg)`,
                top: 0,
                left: 0
            };
        }
        if (gameState === 'landed') {
            const landingPad = document.getElementById('landing-pad');
            if (!landingPad) return { display: 'none' };
            const padRect = landingPad.getBoundingClientRect();
            return {
                transform: 'rotate(0deg)',
                top: `${padRect.top - 58}px`, // 60px height - 2px buffer
                left: `${position.x}px`
            };
        }
        // crashed
        return {
            transform: `translate(${position.x}px, ${position.y}px)`,
            top: 0,
            left: 0
        };
    };

    return (
        <>
            <Instructions />
            <HUD velX={velocity.x} velY={velocity.y} angle={angle} status={gameState} />
            <div id="spaceship-container" style={getShipStyle()} aria-hidden="true">
                {gameState === 'crashed' && <Explosion />}
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: gameState === 'crashed' ? 'none' : 'block' }}>
                    <g id="spaceship" fill="#F97316">
                        {/* Arch */}
                        <path d="M25 70 V 40 C 25 15 75 15 75 40 V 70 H 60 V 40 C 60 25 40 25 40 40 V 70 H 25 Z" />
                        {/* Circle */}
                        <circle cx="50" cy="40" r="10" />
                        {/* Bar */}
                        <path d="M20 75 H 80 V 83 H 60 Q 50 78 40 83 H 20 V 75 Z" />
                        {/* Pointer */}
                        <path d="M40 83 L 60 83 L 50 95 Z" />
                    </g>
                    <g id="spaceship-flame" style={{ opacity: isThrusting && gameState === 'playing' ? 1 : 0, transition: 'opacity 0.1s ease-out' }}>
                        <path d="M40 95 Q 50 115, 60 95" fill="#FBBF24"/>
                        <path d="M45 95 Q 50 108, 55 95" fill="#FDE68A"/>
                    </g>
                </svg>
            </div>
        </>
    );
};

export default ScrollSpaceship;