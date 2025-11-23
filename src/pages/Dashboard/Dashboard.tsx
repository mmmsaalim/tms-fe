import { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./Dashboard.css"; // Import your CSS

// Dummy tasks
const tasks = [
  { id: 1, title: "Design Homepage", assignedTo: "Alice", status: "In Progress" },
  { id: 2, title: "Setup Backend", assignedTo: "Bob", status: "Pending" },
  { id: 3, title: "Create Login Page", assignedTo: "Charlie", status: "Completed" },
  { id: 4, title: "Fix Bug #12", assignedTo: "Alice", status: "In Progress" },
  { id: 5, title: "Deploy App", assignedTo: "Bob", status: "Pending" },
];

// Status colors
const statusColors: Record<string, string> = {
  "In Progress": "#FFD700",
  Completed: "#90EE90",
  Pending: "#FF7F7F",
};

export default function Dashboard() {
  const statusGroups = ["In Progress", "Completed", "Pending"];
  const getTasksByStatus = (status: string) => tasks.filter((task) => task.status === status);

  return (
    <div className="dashboard-container">
      <Typography variant="h4" gutterBottom>
        Task Management Dashboard
      </Typography>

      <div className="status-panels">
        {statusGroups.map((status) => (
          <Accordion key={status} className="status-accordion">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className="accordion-summary"
              style={{ backgroundColor: statusColors[status] }}
            >
              <Typography variant="h6">{status} Tasks</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getTasksByStatus(status).map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.id}</TableCell>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.assignedTo}</TableCell>
                      <TableCell>{task.status}</TableCell>
                    </TableRow>
                  ))}
                  {getTasksByStatus(status).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No tasks in this status
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
