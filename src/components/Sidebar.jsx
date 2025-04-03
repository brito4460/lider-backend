// src/components/Sidebar.jsx
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BuildIcon from '@mui/icons-material/Build';
import PaymentIcon from '@mui/icons-material/Payment';
import AssessmentIcon from '@mui/icons-material/Assessment';

const drawerWidth = 240;

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Início" />
        </ListItem>

        <ListItem button component={Link} to="/estoque">
          <ListItemIcon><InventoryIcon /></ListItemIcon>
          <ListItemText primary="Estoque" />
        </ListItem>

        <ListItem button component={Link} to="/clientes">
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="Clientes" />
        </ListItem>

        <ListItem button component={Link} to="/orcamento">
          <ListItemIcon><ReceiptIcon /></ListItemIcon>
          <ListItemText primary="Orçamento" />
        </ListItem>

        <ListItem button component={Link} to="/servicos">
          <ListItemIcon><BuildIcon /></ListItemIcon>
          <ListItemText primary="Serviços" />
        </ListItem>

        <ListItem button component={Link} to="/pagamento">
          <ListItemIcon><PaymentIcon /></ListItemIcon>
          <ListItemText primary="Pagamento" />
        </ListItem>

        <ListItem button component={Link} to="/relatorio">
          <ListItemIcon><AssessmentIcon /></ListItemIcon>
          <ListItemText primary="Relatório" />
        </ListItem>
        <ListItem button component={Link} to="/gastos">
          <ListItemIcon><AssessmentIcon /></ListItemIcon>
          <ListItemText primary="Gastos" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
