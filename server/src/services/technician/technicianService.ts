import { Field } from "@prisma/client";
import { prisma } from "../../prisma";

/**
 * Gets all unassigned, open tickets for a specific technical field.
 */
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
