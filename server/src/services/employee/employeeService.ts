import { prisma } from "../../prisma";

type Data = {
  userId: string;
  title: string;
  description: string;
  field: "HARDWARE" | "SOFTWARE";
};

interface ReviewData {
  reviewRating: number;
  reviewComment: string;
}

// Usage examples:
// const active = await getTickets({ status: { in: ['OPEN', 'IN_PROGRESS'] } });
// const hardwareOnly = await getTickets({ field: 'HARDWARE' });
export const getUserTickets = async (userId: string, filters = {}) => {
  return await prisma.ticket.findMany({
    where: {
      OR: [{ makerId: userId }, { assigneeId: userId }],
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
        // Connect the ticket to the user who made it
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
    console.error("Error making ticket:", error);
    throw error;
  }
};

export const submitTicketReview = async (
  ticketId: string,
  reviewData: ReviewData,
) => {
  try {
    //const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

    //if (ticket.makerId !== currentUserId) {
    //  throw new Error("Only the creator can rate this ticket");
    //}

    const updatedTicket = await prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        reviewRating: reviewData.reviewRating,
        reviewComment: reviewData.reviewComment,
        status: "CLOSED",
      },
    });

    return updatedTicket;
  } catch (error) {
    // Prisma throws a P2025 error if the ID doesn't exist
    console.error("Failed to submit review:", error);
    throw error;
  }
};
