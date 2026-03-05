import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const toggleTheme = () => setDark((d) => !d)

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
