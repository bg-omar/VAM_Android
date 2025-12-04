
import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { SimulationConfig, GlobalSettings, Ball, Vector2 } from '../types';
import { generatePolygon, generateStar, add, mult, dot, sub, normalize, mag } from '../utils/math';

@Component({
  selector: 'app-canvas',
  standalone: true,
  template: `<canvas #canvas class="w-full h-full block"></canvas>`
})
export class CanvasComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input({ required: true }) config!: SimulationConfig;
  @Input({ required: true }) globalSettings!: GlobalSettings;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private requestRef: number | null = null;
  private state = {
    balls: [] as Ball[],
    rotation: 0,
    innerRotation: 0,
  };

  ngAfterViewInit() {
    // Ensure canvas size is accurate before spawning logic
    if (this.canvasRef) {
        const canvas = this.canvasRef.nativeElement;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
    
    this.initializeSimulation();
    this.startLoop();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config'] && !changes['config'].firstChange) {
        this.initializeSimulation();
    }
  }

  ngOnDestroy() {
    if (this.requestRef) {
      cancelAnimationFrame(this.requestRef);
    }
  }

  private initializeSimulation() {
    const balls: Ball[] = [];
    const isSST = this.config.physicsModel === 'sst-hydrogen';
    const isSwarm = this.config.physicsModel === 'dual-ring-swarm';
    const isFluid = this.config.physicsModel === 'fluid-vortex';
    
    // Determine bounds
    let width = 300; // fallback
    let height = 300;
    if (this.canvasRef) {
        width = this.canvasRef.nativeElement.width;
        height = this.canvasRef.nativeElement.height;
    }
    
    const BASE_R = 150; 
    const swarmInnerR_rel = isSwarm ? (this.config.swarmParams?.innerRadius || 0.4) : 0;

    // Helper to find a non-overlapping position
    const spawnBall = (radius: number, positionGenerator: () => Vector2): Vector2 => {
        let bestPos = positionGenerator();
        let maxAttempts = 50; 
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            let overlap = false;
            // Check against existing balls
            for (const other of balls) {
                const dist = mag(sub(other.pos, bestPos));
                if (dist < other.radius + radius) {
                    overlap = true;
                    break;
                }
            }
            if (!overlap) return bestPos; 
            bestPos = positionGenerator();
        }
        return bestPos; 
    };

    // --- 1. Outer / Main Group ---
    const outerCount = this.config.ballCount;
    for (let i = 0; i < outerCount; i++) {
      const radius = this.config.ballSize;
      
      const posGenerator = () => {
          const angle = Math.random() * Math.PI * 2;
          
          if (this.config.useCanvasBounds) {
              const margin = radius * 2;
              return {
                  x: (Math.random() - 0.5) * (width - margin * 2),
                  y: (Math.random() - 0.5) * (height - margin * 2)
              };
          }

          if (isSST) {
              const dist = 100 + Math.random() * 20;
              return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
          }
          if (isSwarm) {
              const r = BASE_R * swarmInnerR_rel + radius * 2;
              const R = BASE_R - radius * 2;
              const dist = r + Math.random() * (R - r);
              return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
          }
          
          // Default
          const dist = Math.random() * (BASE_R - radius);
          return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
      };

      const pos = spawnBall(radius, posGenerator);
      
      // Initial Velocity
      let speed = this.config.initialSpeed * (0.5 + Math.random());
      if (isSST) speed = 9;
      const angle = Math.atan2(pos.y, pos.x);
      const velAngle = isSST ? angle + Math.PI / 2 : Math.random() * Math.PI * 2;

      balls.push({
        id: `outer-${i}`,
        pos: pos,
        vel: { x: Math.cos(velAngle) * speed, y: Math.sin(velAngle) * speed },
        radius: radius,
        color: isSST ? '#FACC15' : isFluid ? '#60A5FA' : '#22D3EE',
        group: 'outer'
      });
    }

    // --- 2. Inner / Secondary Group ---
    if ((isSwarm && this.config.swarmParams) || (isFluid && this.config.fluidVortexParams)) {
        
        const innerCount = isSwarm ? this.config.swarmParams!.innerBallCount : this.config.fluidVortexParams!.innerBallCount;
        const innerLimit = isSwarm ? this.config.swarmParams!.innerRadius : this.config.fluidVortexParams!.vortexRadius;

        for (let i = 0; i < innerCount; i++) {
            const radius = this.config.ballSize;
            const posGenerator = () => {
                const angle = Math.random() * Math.PI * 2;
                const maxDist = (BASE_R * innerLimit) - radius * 2;
                const dist = Math.random() * Math.max(0, maxDist);
                return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
            };

            const pos = spawnBall(radius, posGenerator);
            const speed = this.config.initialSpeed;
            const velAngle = Math.random() * Math.PI * 2;
            
            balls.push({
                id: `inner-${i}`,
                pos: pos,
                vel: { x: Math.cos(velAngle) * speed, y: Math.sin(velAngle) * speed },
                radius: radius,
                color: isFluid ? '#A78BFA' : '#E879F9',
                group: 'inner'
            });
        }
    }

    this.state = {
      balls,
      rotation: 0,
      innerRotation: 0
    };
  }

  private startLoop() {
    const tick = () => {
        if (!this.canvasRef) return;
        const canvas = this.canvasRef.nativeElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
    
        const { clientWidth, clientHeight } = canvas;
        if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
            canvas.width = clientWidth;
            canvas.height = clientHeight;
        }
    
        this.updatePhysics(canvas.width, canvas.height);
        this.draw(ctx, canvas.width, canvas.height);
        this.requestRef = requestAnimationFrame(tick);
    };
    this.requestRef = requestAnimationFrame(tick);
  }

  private updatePhysics(width: number, height: number) {
    const { gravityMultiplier, timeScale, rotationMultiplier, bouncinessMultiplier } = this.globalSettings;
    const isSST = this.config.physicsModel === 'sst-hydrogen';
    const isSwarm = this.config.physicsModel === 'dual-ring-swarm';
    const isFluid = this.config.physicsModel === 'fluid-vortex';
    
    // Sub-stepping configuration
    // 8 sub-steps provides very stable stacking and fluid behavior
    const SUB_STEPS = 8;
    const dt = timeScale / SUB_STEPS;
    const shapeRadius = Math.min(width, height) * 0.45;

    for (let step = 0; step < SUB_STEPS; step++) {
        
        // --- 1. Update State (Rotation) ---
        // Increment rotation per sub-step for accurate moving wall collisions
        this.state.rotation += (this.config.rotationSpeed * rotationMultiplier * dt);
        
        if (isSwarm && this.config.swarmParams) {
            this.state.innerRotation += (this.config.swarmParams.innerRotationSpeed * rotationMultiplier * dt);
        }
        if (isFluid && this.config.fluidVortexParams) {
            this.state.innerRotation += (this.config.fluidVortexParams.vortexStrength * 0.05 * rotationMultiplier * dt);
        }

        // Generate Boundary Vertices
        let localVertices: Vector2[] = [];
        if (!this.config.useCanvasBounds) {
            if (!isSwarm && this.config.shapeType === 'star') {
                localVertices = generateStar(this.config.vertexCount || 5, shapeRadius, shapeRadius * 0.4, {x:0,y:0}, this.state.rotation);
            } else if (!isSwarm) {
                localVertices = generatePolygon(this.config.vertexCount || 4, shapeRadius, {x:0,y:0}, this.state.rotation);
            }
        }

        // --- 2. Update Balls (Integration & Forces) ---
        this.state.balls.forEach(ball => {
            
            // External Forces
            if (isSST && this.config.sstParams) {
                 const r = mag(ball.pos);
                 const rc = this.config.sstParams.coreRadius;
                 const lambda = this.config.sstParams.coupling;
                 const forceMag = (lambda * r) / Math.pow(r*r + rc*rc, 1.5);
                 const forceDir = normalize(mult(ball.pos, -1));
                 ball.vel = add(ball.vel, mult(forceDir, forceMag * gravityMultiplier * dt));

                 if (this.config.sstParams.maxSpeed) {
                     const currentSpeed = mag(ball.vel);
                     const limit = this.config.sstParams.maxSpeed;
                     if (currentSpeed > limit) ball.vel = mult(ball.vel, 0.90);
                 }
            } else {
                ball.vel.y += this.config.gravity * gravityMultiplier * dt;
            }

            // Fluid Vortex Force
            if (isFluid && this.config.fluidVortexParams) {
                // Use smaller dimension for vortex scale if filling canvas
                const refSize = this.config.useCanvasBounds ? Math.min(width, height) * 0.5 : shapeRadius;
                const vortexR = refSize * this.config.fluidVortexParams.vortexRadius;
                
                const dist = mag(ball.pos);
                if (dist < vortexR) {
                     const strength = this.config.fluidVortexParams.vortexStrength;
                     const tangent = normalize({ x: -ball.pos.y, y: ball.pos.x });
                     // Scale force by sub-step dt
                     ball.vel = add(ball.vel, mult(tangent, strength * 0.1 * rotationMultiplier * dt));
                }
            }

            // Friction
            const friction = isSST ? 0 : this.config.friction;
            ball.vel = mult(ball.vel, 1 - friction * dt);
            
            // Integrate Position
            ball.pos = add(ball.pos, mult(ball.vel, dt));

            // --- 3. Wall Collisions ---
            const restitution = this.config.restitution * bouncinessMultiplier;

            if (this.config.useCanvasBounds) {
                const halfW = width / 2;
                const halfH = height / 2;
                
                // Right
                if (ball.pos.x + ball.radius > halfW) {
                    ball.pos.x = halfW - ball.radius;
                    ball.vel.x *= -restitution;
                }
                // Left
                if (ball.pos.x - ball.radius < -halfW) {
                    ball.pos.x = -halfW + ball.radius;
                    ball.vel.x *= -restitution;
                }
                // Bottom
                if (ball.pos.y + ball.radius > halfH) {
                    ball.pos.y = halfH - ball.radius;
                    ball.vel.y *= -restitution;
                }
                // Top
                if (ball.pos.y - ball.radius < -halfH) {
                    ball.pos.y = -halfH + ball.radius;
                    ball.vel.y *= -restitution;
                }

            } else if (isSwarm && this.config.swarmParams) {
                const innerR = shapeRadius * this.config.swarmParams.innerRadius;
                const outerR = shapeRadius;
                const dist = mag(ball.pos);

                // Outer Wall
                if (dist + ball.radius > outerR) {
                     const normal = normalize(mult(ball.pos, -1));
                     const penetration = (dist + ball.radius) - outerR;
                     ball.pos = add(ball.pos, mult(normal, penetration));
                     const vDotN = dot(ball.vel, normal);
                     if (vDotN < 0) {
                         const reflect = mult(normal, 2 * vDotN);
                         ball.vel = sub(ball.vel, reflect);
                         ball.vel = mult(ball.vel, restitution);
                         // Wall Spin Friction
                         const tangent = { x: -normal.y, y: normal.x };
                         const wallSpeed = this.config.rotationSpeed * outerR * 0.5;
                         ball.vel = add(ball.vel, mult(tangent, wallSpeed * 0.1 * dt));
                     }
                }

                // Inner Wall
                if (ball.group === 'inner') {
                    if (dist + ball.radius > innerR) {
                         const normal = normalize(mult(ball.pos, -1));
                         const penetration = (dist + ball.radius) - innerR;
                         ball.pos = add(ball.pos, mult(normal, penetration));
                         const vDotN = dot(ball.vel, normal);
                         if (vDotN < 0) {
                             const reflect = mult(normal, 2 * vDotN);
                             ball.vel = sub(ball.vel, reflect);
                             ball.vel = mult(ball.vel, restitution);
                             const tangent = { x: -normal.y, y: normal.x };
                             const wallSpeed = this.config.swarmParams.innerRotationSpeed * innerR * 0.5;
                             ball.vel = add(ball.vel, mult(tangent, wallSpeed * 0.1 * dt));
                         }
                    }
                } else {
                    if (dist - ball.radius < innerR) {
                         const normal = normalize(ball.pos);
                         const penetration = innerR - (dist - ball.radius);
                         ball.pos = add(ball.pos, mult(normal, penetration));
                         const vDotN = dot(ball.vel, normal);
                         if (vDotN < 0) {
                             const reflect = mult(normal, 2 * vDotN);
                             ball.vel = sub(ball.vel, reflect);
                             ball.vel = mult(ball.vel, restitution);
                             const tangent = { x: -normal.y, y: normal.x };
                             const wallSpeed = this.config.swarmParams.innerRotationSpeed * innerR * 0.5;
                             ball.vel = add(ball.vel, mult(tangent, wallSpeed * 0.1 * dt));
                         }
                    }
                }

            } else if (this.config.shapeType === 'circle' || isSST) {
                 const dist = mag(ball.pos);
                 if (dist + ball.radius > shapeRadius) {
                     const normal = normalize(mult(ball.pos, -1));
                     const penetration = (dist + ball.radius) - shapeRadius;
                     ball.pos = add(ball.pos, mult(normal, penetration));
                     const vDotN = dot(ball.vel, normal);
                     if (vDotN < 0) {
                         ball.vel = sub(ball.vel, mult(normal, 2 * vDotN));
                         ball.vel = mult(ball.vel, restitution);
                     }
                 }
            } else {
                // Polygon Collisions
                for (let i = 0; i < localVertices.length; i++) {
                    const p1 = localVertices[i];
                    const p2 = localVertices[(i + 1) % localVertices.length];
                    const edge = sub(p2, p1);
                    const edgeNormal = normalize({ x: -edge.y, y: edge.x }); 
                    if (dot(edgeNormal, mult(p1, -1)) < 0) { edgeNormal.x *= -1; edgeNormal.y *= -1; }

                    const relPos = sub(ball.pos, p1);
                    const dist = dot(relPos, edgeNormal);
                    
                    if (dist < ball.radius) {
                        const penetration = ball.radius - dist;
                        ball.pos = add(ball.pos, mult(edgeNormal, penetration));
                        const velDotNormal = dot(ball.vel, edgeNormal);
                        if (velDotNormal < 0) {
                            const reflect = mult(edgeNormal, 2 * velDotNormal);
                            ball.vel = sub(ball.vel, mult(reflect, 1));
                            ball.vel = mult(ball.vel, restitution);
                            ball.vel = add(ball.vel, mult(edgeNormal, 0.1));
                        }
                    }
                }
            }
        });

        // --- 4. Ball-to-Ball Collisions (Sub-step stability) ---
        const balls = this.state.balls;
        const restitution = this.config.restitution * bouncinessMultiplier;

        for (let i = 0; i < balls.length; i++) {
            for (let j = i + 1; j < balls.length; j++) {
                const ballA = balls[i];
                const ballB = balls[j];
                
                if (isSwarm && ballA.group !== ballB.group) continue;

                const distVec = sub(ballB.pos, ballA.pos);
                const distance = mag(distVec);
                const totalRadius = ballA.radius + ballB.radius;

                if (distance < totalRadius) {
                    const overlap = totalRadius - distance;
                    const collisionNormal = distance === 0 ? {x: 1, y: 0} : normalize(distVec);
                    
                    const correctionA = mult(collisionNormal, -overlap * 0.5);
                    const correctionB = mult(collisionNormal, overlap * 0.5);
                    ballA.pos = add(ballA.pos, correctionA);
                    ballB.pos = add(ballB.pos, correctionB);

                    const relativeVelocity = sub(ballB.vel, ballA.vel);
                    const speedAlongNormal = dot(relativeVelocity, collisionNormal);

                    if (speedAlongNormal < 0) {
                        const mA = ballA.radius * ballA.radius;
                        const mB = ballB.radius * ballB.radius;
                        const invMassA = 1 / mA;
                        const invMassB = 1 / mB;
                        
                        const j = -(1 + restitution) * speedAlongNormal / (invMassA + invMassB);
                        
                        const impulse = mult(collisionNormal, j);
                        ballA.vel = sub(ballA.vel, mult(impulse, invMassA));
                        ballB.vel = add(ballB.vel, mult(impulse, invMassB));
                    }
                }
            }
        }
    } // End Sub-steps
    
    // Safety Bounds (run once per frame to catch escapers)
    const maxBound = Math.max(width, height) + 100;
    this.state.balls.forEach(ball => {
      if (Math.abs(ball.pos.x) > maxBound || Math.abs(ball.pos.y) > maxBound) {
           ball.pos = {x: 0, y: 0};
           ball.vel = {x: 0, y: 0};
      }
    });
  }

  private draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.clearRect(0, 0, width, height);
    
    const center = { x: width / 2, y: height / 2 };
    const shapeRadius = Math.min(width, height) * 0.45;
    const isSST = this.config.physicsModel === 'sst-hydrogen';
    const isSwarm = this.config.physicsModel === 'dual-ring-swarm';
    const isFluid = this.config.physicsModel === 'fluid-vortex';

    // --- Draw Container ---
    if (this.config.useCanvasBounds) {
        // Draw subtle border indicating the viewport is the container
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, width, height);

    } else if (isSwarm && this.config.swarmParams) {
        // ... Swarm Draw ...
        ctx.beginPath();
        ctx.arc(center.x, center.y, shapeRadius, 0, Math.PI * 2);
        ctx.strokeStyle = '#22D3EE';
        ctx.lineWidth = 3;
        ctx.stroke();

        const innerR = shapeRadius * this.config.swarmParams.innerRadius;
        ctx.beginPath();
        ctx.arc(center.x, center.y, innerR, 0, Math.PI * 2);
        ctx.strokeStyle = '#E879F9';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = 'rgba(232, 121, 249, 0.05)';
        ctx.fill();

        ctx.save();
        ctx.translate(center.x, center.y);
        ctx.rotate(this.state.innerRotation);
        ctx.beginPath();
        ctx.moveTo(-innerR + 10, 0);
        ctx.lineTo(innerR - 10, 0);
        ctx.moveTo(0, -innerR + 10);
        ctx.lineTo(0, innerR - 10);
        ctx.strokeStyle = 'rgba(232, 121, 249, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

    } else {
        // Standard Polygon/Star/Square
        let points: Vector2[] = [];
        if (this.config.shapeType === 'star') {
             points = generateStar(this.config.vertexCount || 5, shapeRadius, shapeRadius * 0.4, center, this.state.rotation);
        } else {
             points = generatePolygon(this.config.vertexCount || 4, shapeRadius, center, this.state.rotation);
        }
        ctx.beginPath();
        if (points.length > 0) {
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.closePath();
        }
        ctx.strokeStyle = '#22D3EE';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.stroke();
        ctx.fillStyle = 'rgba(34, 211, 238, 0.05)';
        ctx.fill();
    }

    // --- Draw Fluid Vortex Boundary (Ghost Circle) ---
    if (isFluid && this.config.fluidVortexParams) {
        const refSize = this.config.useCanvasBounds ? Math.min(width, height) * 0.5 : shapeRadius;
        const vortexR = refSize * this.config.fluidVortexParams.vortexRadius;
        
        ctx.beginPath();
        ctx.arc(center.x, center.y, vortexR, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(167, 139, 250, 0.4)'; // Light purple
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Spin Indicator
        ctx.save();
        ctx.translate(center.x, center.y);
        ctx.rotate(this.state.innerRotation);
        ctx.beginPath();
        ctx.moveTo(0, -vortexR + 5);
        ctx.lineTo(0, vortexR - 5);
        ctx.moveTo(-vortexR + 5, 0);
        ctx.lineTo(vortexR - 5, 0);
        ctx.strokeStyle = 'rgba(167, 139, 250, 0.1)';
        ctx.stroke();
        ctx.restore();
    }

    // SST Nucleus
    if (isSST && this.config.sstParams) {
        ctx.beginPath();
        ctx.arc(center.x, center.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444'; 
        ctx.fill();
        const rc = this.config.sstParams.coreRadius;
        ctx.beginPath();
        ctx.arc(center.x, center.y, rc, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Draw Balls
    this.state.balls.forEach(ball => {
        const screenX = center.x + ball.pos.x;
        const screenY = center.y + ball.pos.y;
        ctx.beginPath();
        ctx.arc(screenX, screenY, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        if (isSST) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = ball.color;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();
    });
  }
}
