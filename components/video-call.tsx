"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import RewardSystem from './reward-system'

interface VideoCallProps {
  isOpen: boolean
  onClose: () => void
  roomId: string
  userId: string
  userName: string
  sessionId: string
  teacherAddress: string
  learnerAddress: string
  skills: {
    id: string
    name: string
  }[]
  connectionMessage?: string
}

export function VideoCall({ isOpen, onClose, roomId, userId, userName, sessionId, teacherAddress, learnerAddress, skills, connectionMessage }: VideoCallProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const zegoInstanceRef = useRef<any>(null);
  const [permissionError, setPermissionError] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [shouldInitialize, setShouldInitialize] = useState(false);
  const cleanupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [startTime] = useState(Date.now());

  // Error boundary for Next.js
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (args[0]?.includes?.('createSpan')) {
        return;
      }
      originalError.apply(console, args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

  // Cleanup function
  const cleanupZego = useCallback(() => {
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
    }

    if (zegoInstanceRef.current && !zegoInstanceRef.current._destroyed) {
      try {
        // Add a small delay before destroying to allow DOM cleanup
        cleanupTimeoutRef.current = setTimeout(() => {
          try {
            zegoInstanceRef.current.destroy();
          } catch (error: any) {
            // Suppress createSpan error during demo
            if (!error.message?.includes('createSpan')) {
              console.warn("Error during ZegoCloud cleanup:", error);
            }
          }
          zegoInstanceRef.current = null;
        }, 100);
      } catch (error: any) {
        // Suppress createSpan error during demo
        if (!error.message?.includes('createSpan')) {
          console.warn("Error during ZegoCloud cleanup:", error);
        }
        zegoInstanceRef.current = null;
      }
    }
  }, []);

  // Effect to handle initialization
  useEffect(() => {
    let mounted = true;

    const initZego = async () => {
      if (!shouldInitialize || !containerRef.current || isInitializing) {
        return;
      }

      try {
        setIsInitializing(true);
        setInitError(null);

        const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID)
        const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || ""

        if (!appID || !serverSecret) {
          throw new Error("ZEGOCLOUD credentials not found");
        }

        // Generate token
        const token = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomId,
          userId,
          userName
        )

        // Create instance
        const zp = ZegoUIKitPrebuilt.create(token)

        // Join room with specific configurations
        await zp.joinRoom({
          container: containerRef.current,
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: true,
          showMyCameraToggleButton: true,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          showScreenSharingButton: true,
          showTextChat: true,
          showUserList: true,
          maxUsers: 2,
          layout: "Auto",
          showLayoutButton: false,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          onLeaveRoom: () => {
            if (mounted) {
              cleanupZego();
              onClose();
            }
          },
        })

        if (mounted) {
          zegoInstanceRef.current = zp;
        } else {
          cleanupZego();
        }

      } catch (error: any) {
        console.error("Failed to initialize video call:", error);
        if (mounted) {
          setInitError(error.message || "Failed to initialize video call");
          if (error.name === 'NotAllowedError' || error.message.includes('Permission denied')) {
            setPermissionError(true);
          }
        }
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    }

    if (shouldInitialize) {
      // Add a small delay before initialization
      const initTimeout = setTimeout(() => {
        initZego();
      }, 100);
      return () => clearTimeout(initTimeout);
    }

    return () => {
      mounted = false;
      cleanupZego();
    };
  }, [shouldInitialize, roomId, userId, userName, onClose, cleanupZego]);

  // Effect to handle dialog open state
  useEffect(() => {
    if (isOpen) {
      // Wait for the next render cycle to ensure container is mounted
      requestAnimationFrame(() => {
        setShouldInitialize(true);
      });
    } else {
      setShouldInitialize(false);
      cleanupZego();
    }
  }, [isOpen, cleanupZego]);

  // Handle dialog close
  const handleClose = useCallback(() => {
    cleanupZego();
    onClose();
  }, [cleanupZego, onClose]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupZego();
    };
  }, [cleanupZego]);

  useEffect(() => {
    // Calculate session duration every minute
    const interval = setInterval(() => {
      const duration = Math.floor((Date.now() - startTime) / 1000 / 60); // in minutes
      setSessionDuration(duration);
    }, 60000);

    return () => clearInterval(interval);
  }, [startTime]);

  const handleEndSession = () => {
    setSessionEnded(true);
  };

  const handleReviewSubmit = () => {
    // Close the modal immediately after review submission
    onClose();
  };

  const sessionData = {
    id: sessionId,
    teacherAddress,
    learnerAddress,
    duration: sessionDuration,
    subject: "Teaching Session",
    skills,
    connectionMessage
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] p-0">
        <DialogHeader>
          <DialogTitle className="sr-only">Video Call with {userName}</DialogTitle>
          <DialogDescription className="sr-only">Video call interface powered by ZegoCloud.</DialogDescription>
        </DialogHeader>

        {permissionError ? (
          <div className="p-4">
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Permission Denied</AlertTitle>
              <AlertDescription>
                Please allow access to your camera and microphone to start the video call.
              </AlertDescription>
            </Alert>
          </div>
        ) : initError ? (
          <div className="p-4">
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {initError}
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="video-call-container">
            {!sessionEnded ? (
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Video Session</h3>
                    <button
                      onClick={handleEndSession}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      End Session
                    </button>
                  </div>
                  <div id="video-call-container" className="w-full h-[600px] relative">
                    {isInitializing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#678983]" />
                      </div>
                    )}
                    <div ref={containerRef} className="w-full h-full" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="session-complete">
                <h3 className="text-xl font-semibold mb-4">Session Complete!</h3>
                <p className="mb-4">Session duration: {sessionDuration} minutes</p>
                <RewardSystem
                  sessionData={sessionData}
                  onReviewSubmit={handleReviewSubmit}
                />
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 
