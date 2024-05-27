const { PrismaClient } = require("@prisma/client"); // { Prisma, PrismaClient }

const prisma = new PrismaClient();

exports.getAdminById = async (id) => {
  return prisma.admin.findUnique({
    where: { id: id }, 
  });
};
