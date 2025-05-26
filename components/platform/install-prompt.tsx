"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react" //
import { Button } from "@/components/ui/button"
import { usePushNotifications } from "@/hooks/use-push-notifications";

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(true)

  usePushNotifications();

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream)
    setIsAndroid(/Android/.test(navigator.userAgent))
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
      })
    }
  }, [])

  if (!isIOS && !isAndroid) {
    return null
  }

  if (isStandalone || !isVisible) {
    return null
  }

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
      setDeferredPrompt(null)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-80 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Install App</h3>
        <Button variant="ghost" size="icon"
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close"
        >
          <X size={20} />
        </Button>
      </div>

      {deferredPrompt ? <Button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors mb-3"
        onClick={handleInstall}
      >
        Add to Home Screen
      </Button> : null}

      {isIOS && (
        <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          <p>
            To install this app on your iOS device, tap the share button
            <span role="img" aria-label="share icon" className="mx-1">⎋</span>
            and then "Add to Home Screen"
            <span role="img" aria-label="plus icon" className="mx-1">➕</span>.
          </p>
        </div>
      )}

      {isAndroid && (
        <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          <p>
            To install this app, tap the menu button
            <span role="img" aria-label="menu icon" className="mx-1">⋮</span>
            and then "Install app" or "Add to Home screen".
          </p>
        </div>
      )}
    </div>
  )
}

