'use client'

import { useState } from 'react'
import { useCookieConsent, CookieConsent } from '../hooks/useCookieConsent'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import {
  Cookie,
  ShieldCheck,
  ChartBar,
  Megaphone,
  Palette,
  X,
  CaretDown,
  CaretUp
} from '@phosphor-icons/react'

export default function CookieConsentBanner() {
  const { showBanner, acceptAll, acceptNecessary, acceptCustom } = useCookieConsent()
  const [showSettings, setShowSettings] = useState(false)
  const [customConsent, setCustomConsent] = useState<CookieConsent>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  })

  if (!showBanner) return null

  const handleAcceptCustom = () => {
    acceptCustom(customConsent)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-4xl shadow-2xl border-2 border-orange-200 animate-in slide-in-from-bottom duration-500">
        <CardHeader className="relative pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Cookie size={24} className="text-orange-600" weight="fill" />
              </div>
              <div>
                <CardTitle className="text-xl font-heading">Cookie Preferences</CardTitle>
                <CardDescription className="mt-1">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick Actions */}
          {!showSettings && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={acceptAll}
                className="flex-1 bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:via-amber-700 hover:to-orange-800 text-white shadow-lg"
                size="lg"
              >
                <ShieldCheck size={20} className="mr-2" weight="fill" />
                Accept All Cookies
              </Button>
              <Button
                onClick={acceptNecessary}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                Necessary Only
              </Button>
              <Button
                onClick={() => setShowSettings(!showSettings)}
                variant="ghost"
                size="lg"
              >
                Customize
                {showSettings ? <CaretUp size={16} className="ml-2" /> : <CaretDown size={16} className="ml-2" />}
              </Button>
            </div>
          )}

          {/* Detailed Settings */}
          {showSettings && (
            <div className="space-y-4 border-t pt-4">
              {/* Necessary Cookies */}
              <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-3 flex-1">
                  <ShieldCheck size={24} className="text-green-600 mt-1" weight="fill" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Necessary Cookies</h3>
                      <Badge variant="secondary" className="text-xs">Always Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Essential for the website to function properly. Cannot be disabled.
                    </p>
                  </div>
                </div>
                <Switch checked={true} disabled className="mt-1" />
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                <div className="flex items-start gap-3 flex-1">
                  <ChartBar size={24} className="text-blue-600 mt-1" weight="fill" />
                  <div className="flex-1">
                    <h3 className="font-semibold">Analytics Cookies</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Help us understand how visitors interact with our website. Used for improving user experience.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={customConsent.analytics}
                  onCheckedChange={(checked) => setCustomConsent({ ...customConsent, analytics: checked })}
                  className="mt-1"
                />
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                <div className="flex items-start gap-3 flex-1">
                  <Megaphone size={24} className="text-purple-600 mt-1" weight="fill" />
                  <div className="flex-1">
                    <h3 className="font-semibold">Marketing Cookies</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Track visitors across websites to display relevant advertisements and campaigns.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={customConsent.marketing}
                  onCheckedChange={(checked) => setCustomConsent({ ...customConsent, marketing: checked })}
                  className="mt-1"
                />
              </div>

              {/* Preferences Cookies */}
              <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                <div className="flex items-start gap-3 flex-1">
                  <Palette size={24} className="text-orange-600 mt-1" weight="fill" />
                  <div className="flex-1">
                    <h3 className="font-semibold">Preference Cookies</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Remember your preferences like language, region, and other customization settings.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={customConsent.preferences}
                  onCheckedChange={(checked) => setCustomConsent({ ...customConsent, preferences: checked })}
                  className="mt-1"
                />
              </div>

              {/* Custom Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  onClick={handleAcceptCustom}
                  className="flex-1 bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:via-amber-700 hover:to-orange-800 text-white"
                  size="lg"
                >
                  Save Preferences
                </Button>
                <Button
                  onClick={() => setShowSettings(false)}
                  variant="outline"
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Privacy Policy Link */}
          <p className="text-xs text-center text-muted-foreground">
            By continuing to use our site, you agree to our{' '}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
