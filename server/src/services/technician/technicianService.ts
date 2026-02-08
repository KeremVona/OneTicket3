import { Field } from "@prisma/client";
import { prisma } from "../../prisma";

export const getTechnicianQueue = async (field: Field) => {
  return await prisma.ticket.findMany({
    where: {
      field: field,
      status: "OPEN",
      assigneeId: null,
    },
    include: {
      maker: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      madeAt: "asc",
    },
  });
};

export const claimTicket = async (ticketId: string, technicianId: string) => {
  return await prisma.$transaction(async (tx) => {
    const ticket = await tx.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new Error("TICKET_NOT_FOUND");
    }

    if (ticket.assigneeId) {
      throw new Error("ALREADY_ASSIGNED");
    }

    const updatedTicket = await tx.ticket.update({
      where: { id: ticketId },
      data: {
        assigneeId: technicianId,
        status: "IN_PROGRESS",
      },
      include: {
        maker: true,
      },
    });

    return updatedTicket;
  });
};

export const markTicketFixed = async (
  ticketId: string,
  technicianId: string,
) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw new Error("TICKET_NOT_FOUND");
  }

  if (ticket.assigneeId !== technicianId) {
    throw new Error("UNAUTHORIZED_ACCESS");
  }

  const updatedTicket = await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status: "FIXED",
      // fixed_at
    },
    include: {
      maker: true, // Return maker info (potential feature email notification)
    },
  });

  return updatedTicket;
};
