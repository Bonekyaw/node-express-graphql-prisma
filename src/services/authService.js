const { PrismaClient } = require("@prisma/client"); // { Prisma, PrismaClient }

const prisma = new PrismaClient();

exports.getAdminByPhone = async (phone) => {
  return prisma.admin.findUnique({
    where: { phone: phone }, // { phone }
  });
};

exports.getOtpByPhone = async (phone) => {
  return prisma.otp.findUnique({
    where: { phone: phone }, // { phone }
  });
};

exports.createOtp = async (otpData) => {
  return prisma.otp.create({ data: otpData });
};

exports.updateOtp = async (id, otpData) => {
  return prisma.otp.update({
    where: { id: id },
    data: otpData,
  });
};

exports.createAdmin = async (adminData) => {
  return prisma.admin.create({ data: adminData });
};

exports.updateAdmin = async (id, adminData) => {
  return prisma.admin.update({
    where: { id: id },
    data: adminData,
  });
};

exports.getAllAdmins = async ( filteredData ) => {
  return prisma.admin.findMany( filteredData );
};