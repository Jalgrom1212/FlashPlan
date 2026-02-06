"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, ChevronRight, Globe, Sun, Moon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useTranslation, languages, type Language } from "@/lib/i18n"
import { useTheme } from "@/lib/theme-context"
import { useAuth } from "@/lib/hooks/use-auth"

export function SettingsPage() {
  const router = useRouter()
  const { t, language, setLanguage } = useTranslation()
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()

  const [settings, setSettings] = useState({
    notifications: true,
    locationServices: true,
    emailUpdates: false,
    showDistance: true,
    autoRefresh: true,
  })

  const [showLanguageSelector, setShowLanguageSelector] = useState(false)

  useEffect(() => {
    if (user?.settings) {
      setSettings({
        notifications: user.settings.notifications ?? true,
        locationServices: user.settings.locationServices ?? true,
        emailUpdates: user.settings.emailUpdates ?? false,
        showDistance: user.settings.showDistance ?? true,
        autoRefresh: user.settings.autoRefresh ?? true,
      })
    }
  }, [user])

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: !prev[key] }
      fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            ...newSettings,
            theme,
            language,
          },
        }),
      })
      return newSettings
    })
  }

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    setShowLanguageSelector(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-foreground hover:text-accent transition-all hover:scale-110"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">{t("configuration")}</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Notifications Section */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">{t("notificationsSection")}</h2>
          <Card className="p-4 bg-card border-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{t("pushNotifications")}</h3>
                <p className="text-sm text-muted-foreground">{t("receiveAlerts")}</p>
              </div>
              <Switch checked={settings.notifications} onCheckedChange={() => handleToggle("notifications")} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{t("emailNotifications")}</h3>
                <p className="text-sm text-muted-foreground">{t("weeklyUpdates")}</p>
              </div>
              <Switch checked={settings.emailUpdates} onCheckedChange={() => handleToggle("emailUpdates")} />
            </div>
          </Card>
        </div>

        {/* Privacy Section */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">{t("privacy")}</h2>
          <Card className="p-4 bg-card border-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{t("locationServices")}</h3>
                <p className="text-sm text-muted-foreground">{t("findNearbyPlans")}</p>
              </div>
              <Switch checked={settings.locationServices} onCheckedChange={() => handleToggle("locationServices")} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{t("showDistance")}</h3>
                <p className="text-sm text-muted-foreground">{t("seeKmInPlans")}</p>
              </div>
              <Switch checked={settings.showDistance} onCheckedChange={() => handleToggle("showDistance")} />
            </div>
          </Card>
        </div>

        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">{t("appearance")}</h2>
          <Card className="p-4 bg-card border-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === "dark" ? <Moon className="w-5 h-5 text-accent" /> : <Sun className="w-5 h-5 text-accent" />}
                <div>
                  <h3 className="font-semibold text-foreground">{t("darkMode")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {theme === "dark" ? t("spaceTheme") : "Tema claro activado"}
                  </p>
                </div>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={handleThemeToggle} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{t("autoRefresh")}</h3>
                <p className="text-sm text-muted-foreground">{t("refreshPlansAuto")}</p>
              </div>
              <Switch checked={settings.autoRefresh} onCheckedChange={() => handleToggle("autoRefresh")} />
            </div>
          </Card>
        </div>

        {/* Language Section */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">{t("language")}</h2>
          <Card className="p-4 bg-card border-border">
            <button
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className="w-full flex items-center justify-between hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-accent" />
                <div className="text-left">
                  <h3 className="font-semibold text-foreground">{t("language")}</h3>
                  <p className="text-sm text-muted-foreground">{languages[language]}</p>
                </div>
              </div>
              <ChevronRight
                className={`w-5 h-5 text-muted-foreground transition-transform ${showLanguageSelector ? "rotate-90" : ""}`}
              />
            </button>

            {showLanguageSelector && (
              <div className="mt-4 space-y-2 border-t border-border pt-4">
                {Object.entries(languages).map(([code, name]) => (
                  <button
                    key={code}
                    onClick={() => handleLanguageChange(code as Language)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      language === code ? "bg-accent/20 text-accent font-semibold" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Account Actions */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">{t("account")}</h2>
          <div className="space-y-3">
            <Card className="p-4 bg-card border-border hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{t("changePassword")}</h3>
                  <p className="text-sm text-muted-foreground">{t("updatePassword")}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>
            <Card className="p-4 bg-card border-border hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{t("paymentMethods")}</h3>
                  <p className="text-sm text-muted-foreground">{t("manageCards")}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>
            <Card className="p-4 bg-card border-destructive/50 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-destructive">{t("deleteAccount")}</h3>
                  <p className="text-sm text-muted-foreground">{t("permanentAction")}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-destructive" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
