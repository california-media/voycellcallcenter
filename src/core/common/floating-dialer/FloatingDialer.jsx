import React, { useState, useEffect } from 'react';

export default function FloatingDialer() {
  const [isOpen, setIsOpen] = useState(true);
  const [callStatus, setCallStatus] = useState('Connecting...');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showDialpad, setShowDialpad] = useState(false);
  const [dialpadNumber, setDialpadNumber] = useState('');
  const [position, setPosition] = useState({ x: window.innerWidth - 340, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // --- DRAGGABLE LOGIC ---
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    setPosition({
      x: Math.min(Math.max(newX, 0), window.innerWidth - 320),
      y: Math.min(Math.max(newY, 0), window.innerHeight - 100),
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // --- DIALPAD FUNCTIONS ---
  const handleDialpadClick = (num) => setDialpadNumber((prev) => prev + num);
  const handleDialpadClear = () => {
    setDialpadNumber((prev) => prev.slice(0, -1));
  };
  const handleEndCall = () => {
    setCallStatus('Call Ended');
    setTimeout(() => setIsOpen(false), 800);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const styles = {
    floatingDialer: {
      position: 'fixed',
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: '320px',
      height: '480px',
      background: '#1a1a1a',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      overflow: 'hidden',
      zIndex: 1000,
      userSelect: 'none',
      cursor: isDragging ? 'grabbing' : 'default',
    },
    dialerHeader: {
      background: '#2d2d2d',
      padding: '12px 16px',
      cursor: 'grab',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      color: 'white',
      margin: 0,
      fontWeight: 500,
      fontSize: '16px',
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      color: '#888',
      fontSize: '28px',
      lineHeight: 1,
      padding: 0,
      cursor: 'pointer',
    },
    dialerBody: {
      padding: '24px',
      textAlign: 'center',
      position: 'relative', // to contain absolute dialpad
      height: 'calc(100% - 56px)',
      overflow: 'hidden',
    },
    avatar: {
      width: '64px',
      height: '64px',
      background: '#3a3a3a',
      borderRadius: '50%',
      margin: '0 auto 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      color: '#888',
    },
    callerName: {
      color: 'white',
      fontSize: '20px',
      fontWeight: 600,
      marginBottom: '4px',
    },
    callerNumber: {
      color: '#888',
      fontSize: '14px',
      marginBottom: '16px',
    },
    callStatus: {
      color: '#888',
      fontSize: '14px',
      marginBottom: '4px',
    },
    callDuration: {
      color: '#4ade80',
      fontSize: '18px',
      fontFamily: 'monospace',
      marginBottom: '24px',
    },
    actionGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
      marginBottom: '16px',
    },
    actionBtn: {
      background: 'transparent',
      border: 'none',
      padding: '12px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background 0.2s',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
    },
    actionBtnActive: {
      background: '#3a3a3a',
    },
    actionBtnMuted: {
      background: '#dc2626',
    },
    actionEmoji: {
      fontSize: '24px',
    },
    actionLabel: {
      color: 'white',
      fontSize: '12px',
    },
    dialpadOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: '#2d2d2d',
      padding: '16px',
      borderRadius: '8px',
      transition: 'opacity 0.3s ease',
      opacity: showDialpad ? 1 : 0,
      pointerEvents: showDialpad ? 'auto' : 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    dialpadDisplay: {
      background: '#1a1a1a',
      padding: '12px',
      borderRadius: '8px',
      color: 'white',
      fontSize: '18px',
      fontFamily: 'monospace',
      textAlign: 'center',
      minHeight: '48px',
      marginBottom: '12px',
    },
    dialpadGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
    },
    dialpadBtn: {
      background: '#3a3a3a',
      border: 'none',
      padding: '16px',
      borderRadius: '8px',
      color: 'white',
      fontSize: '18px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    clearBtn: {
      width: '100%',
      marginTop: '8px',
      background: '#dc2626',
      border: 'none',
      padding: '8px',
      borderRadius: '8px',
      color: 'white',
      cursor: 'pointer',
      fontSize: '14px',
    },
    endCallBtn: {
      width: '64px',
      height: '64px',
      background: '#dc2626',
      border: 'none',
      borderRadius: '50%',
      fontSize: '32px',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
      margin: '0 auto',
      display: 'block',
    },
  };

  if (!isOpen) return null;

  return (
    <div style={styles.floatingDialer}>
      <div
        className="drag-handle"
        style={styles.dialerHeader}
        onMouseDown={handleMouseDown}
      >
        <h6 style={styles.headerTitle}>Outgoing Call</h6>
        <button style={styles.closeBtn} onClick={() => setIsOpen(false)}>
          ×
        </button>
      </div>

      <div style={styles.dialerBody}>
        {/* MAIN CONTENT */}
        <div style={{ opacity: showDialpad ? 0.2 : 1, transition: 'opacity 0.3s' }}>
          <div style={styles.avatar}>VC</div>
          <div style={styles.callerName}>Vipul Chavda</div>
          <div style={styles.callerNumber}>+91 82009 16223</div>
          <div style={styles.callStatus}>{callStatus}</div>
          <div style={styles.callDuration}>{formatTime(callDuration)}</div>

          <div style={styles.actionGrid}>
            <button
              style={{ ...styles.actionBtn, ...(isMuted ? styles.actionBtnMuted : {}) }}
              onClick={() => setIsMuted(!isMuted)}
            >
              <span style={styles.actionEmoji}>{isMuted ? '🔇' : '🎤'}</span>
              <span style={styles.actionLabel}>Mute</span>
            </button>

            <button
              style={{
                ...styles.actionBtn,
                ...(showDialpad ? styles.actionBtnActive : {}),
              }}
              onClick={() => setShowDialpad(!showDialpad)}
            >
              <span style={styles.actionEmoji}>🔢</span>
              <span style={styles.actionLabel}>Dialpad</span>
            </button>
          </div>

          <button style={styles.endCallBtn} onClick={handleEndCall}>
            📞
          </button>
        </div>

        {/* OVERLAY DIALPAD */}

        <div style={styles.dialpadOverlay}>
          <div style={styles.dialpadDisplay}>{dialpadNumber || ''}</div>
          <div style={styles.dialpadGrid}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((num) => (
              <button
                key={num}
                style={styles.dialpadBtn}
                onClick={() => handleDialpadClick(num)}
              >
                {num}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            {/* Clear button (only shown if there’s input) */}
            {dialpadNumber && (
              <button
                style={{ ...styles.clearBtn, flex: 1 }}
                onClick={handleDialpadClear}
              >
                ← Clear
              </button>
            )}

            {/* Dial button */}
            <button
              style={{
                ...styles.clearBtn,
                flex: 1,
                background: dialpadNumber ? '#4ade80' : '#3a3a3a',
                color: dialpadNumber ? 'black' : '#888',
                fontWeight: 600,
                cursor: dialpadNumber ? 'pointer' : 'not-allowed',
              }}
              disabled={!dialpadNumber}
              onClick={() => {
                if (dialpadNumber) {
                  setCallStatus(`Dialing ${dialpadNumber}...`);
                  setShowDialpad(false);
                }
              }}
            >
              📞 Dial
            </button>

          </div>


          {/* 🆕 BACK BUTTON */}
          <button
            style={{ ...styles.clearBtn, background: '#3a3a3a', marginTop: '8px' }}
            onClick={() => setShowDialpad(false)}
          >
            ⬅ Back
          </button>
        </div>

      </div>
    </div>
  );
}
