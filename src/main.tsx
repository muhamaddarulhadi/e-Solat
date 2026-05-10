import React from 'react'
import ReactDOM from 'react-dom/client'
import dayjs from 'dayjs'
import 'dayjs/locale/ms'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { ThemeProvider } from './contexts/ThemeContext'
import App from './App.tsx'
import './index.css'

dayjs.extend(localizedFormat)
dayjs.locale('ms')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
