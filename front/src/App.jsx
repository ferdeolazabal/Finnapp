import { Alert, AppBar, Box, Card, CardContent, Container, CssBaseline, Grid, Toolbar, Typography } from '@mui/material';
const sections = ['Resumen de cartera', 'Ganancia o pérdida neta', 'Distribución y concentración', 'Posiciones abiertas', 'Alertas de riesgo', 'Análisis del agente', 'Diario de trading', 'Reglas de riesgo'];
export function App() {
  return <><CssBaseline /><AppBar position="static"><Toolbar><Typography variant="h6">Trading AI Agent</Typography></Toolbar></AppBar><Container sx={{ py: 4 }}><Alert severity="info" sx={{ mb: 3 }}>Modo auditor: no hay operaciones reales habilitadas.</Alert><Grid container spacing={2}>{sections.map((title) => <Grid key={title} size={{ xs: 12, md: 6 }}><Card variant="outlined"><CardContent><Typography variant="h6">{title}</Typography><Box sx={{ color: 'text.secondary', mt: 1 }}>Pendiente de conectar con la API segura del MVP.</Box></CardContent></Card></Grid>)}</Grid></Container></>;
}

