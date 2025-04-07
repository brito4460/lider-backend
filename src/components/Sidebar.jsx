import React from 'react';
import { List, ListItemButton, ListItemText, Drawer } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <List>
        <ListItemButton component={Link} to="/estoque">
          <ListItemText primary="Estoque" />
        </ListItemButton>

        <ListItemButton component={Link} to="/pagamento">
          <ListItemText primary="Pagamento" />
        </ListItemButton>

        <ListItemButton component={Link} to="/relatorio">
          <ListItemText primary="Relatório" />
        </ListItemButton>

        <ListItemButton component={Link} to="/gastos">
          <ListItemText primary="Gastos" />
        </ListItemButton>

        <ListItemButton component={Link} to="/clientes">
          <ListItemText primary="Clientes" />
        </ListItemButton>

        <ListItemButton component={Link} to="/servicos">
          <ListItemText primary="Serviços" />
        </ListItemButton>

        <ListItemButton component={Link} to="/orcamento">
          <ListItemText primary="Orçamento" />
        </ListItemButton>

        <ListItemButton component={Link} to="/motos-alugadas">
          <ListItemText primary="Motos Alugadas" />
        </ListItemButton>

      </List>
    </Drawer>
  );
};

export default Sidebar;
