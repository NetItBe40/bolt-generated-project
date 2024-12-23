import React, { useRef, useEffect } from 'react';

const WaveformVisualizer = ({ isRecording }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let points = [];
    let currentX = 0;

    const drawWave = () => {
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      
      points.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      
      ctx.strokeStyle = '#4285f4';
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const animate = () => {
      if (isRecording) {
        // Simuler une forme d'onde aléatoire
        const centerY = canvas.height / 2;
        const amplitude = Math.random() * 20 + 10;
        
        points.push({
          x: currentX,
          y: centerY + Math.sin(currentX * 0.05) * amplitude
        });

        // Faire défiler la forme d'onde vers la gauche
        if (points.length > canvas.width / 2) {
          points.shift();
          points = points.map(point => ({
            x: point.x - 2,
            y: point.y
          }));
        }

        currentX += 2;
        if (currentX > canvas.width) {
          currentX = canvas.width;
        }

        drawWave();
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isRecording) {
      animate();
    } else {
      // Réinitialiser la visualisation
      points = [];
      currentX = 0;
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={100}
      className="waveform-canvas"
    />
  );
};

export default WaveformVisualizer;
