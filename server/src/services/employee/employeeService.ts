import { Role, Field } from "@prisma/client";
import { prisma } from "../../prisma";

type Data = {
  userId: string;
  title: string;
  description: string;
  field: "HARDWARE" | "SOFTWARE";
};

// Usage examples:
// const active = await getTickets({ status: { in: ['OPEN', 'IN_PROGRESS'] } });
// const hardwareOnly = await getTickets({ field: 'HARDWARE' });
export const getTickets = async (filters = {}) => {
  return await prisma.ticket.findMany({
    where: {
      ...filters,
    },
    orderBy: {
      madeAt: "desc",
    },
  });
};

export const makeTicket = async (data: Data) => {
  try {
    const newTicket = await prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        field: data.field, // Must be 'HARDWARE' or 'SOFTWARE'
        // Connect the ticket to the user who created it
        maker: {
          connect: { id: data.userId },
        },
      },
      // This returns the ticket AND the maker's info in one go
      include: {
        maker: true,
      },
    });

    return newTicket;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};
