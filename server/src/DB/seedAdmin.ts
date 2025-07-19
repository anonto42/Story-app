import { User } from '../app/modules/user/user.model';
import config from '../config';
import { USER_ROLES } from '../enums/user';
import { logger } from '../shared/logger';

const payload = {
  name: 'Administrator',
  email: config.super_admin.email,
  role: USER_ROLES.ADMIN,
  password: config.super_admin.password,
};

export const seedSuperAdmin = async () => {
  try {
    const isExistSuperAdmin = await User.findOne({
      email: config.super_admin.email,
      role: USER_ROLES.ADMIN,
    });
    if (!isExistSuperAdmin) {
      await User.create(payload);
      logger.info('✨ Super Admin account has been successfully created!');
    }
  } catch (error) {
    console.log(error)
  }
};
