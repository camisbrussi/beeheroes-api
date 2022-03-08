import { Router } from 'express';
import multer from 'multer';

import { ProfileUserController } from '@modules/accounts/useCases/profileUser/ProfileUserController';
import { UpdateUserAvatarController } from '@modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarController';
import { CreateUserController } from '@modules/accounts/useCases/User/create/CreateController';
import { FilterUserController } from '@modules/accounts/useCases/User/filter/FilterController';
import { FindUserController } from '@modules/accounts/useCases/User/find/FindController';
import { ListUserController } from '@modules/accounts/useCases/User/list/ListUserController';
import { UpdateUserController } from '@modules/accounts/useCases/User/update/UpdateController';

import uploadConfig from '../../../../config/upload';
import { ensureAuthentication } from '../middlewares/ensureAuthentication';

const usersRoutes = Router();

const uploadAvatar = multer(uploadConfig);

const createUserController = new CreateUserController();
const findUserController = new FindUserController();
const updateUserController = new UpdateUserController();
const listUserController = new ListUserController();
const filterUserController = new FilterUserController();
const updateUserAvatarController = new UpdateUserAvatarController();
const profileUserController = new ProfileUserController();

usersRoutes.post('/', createUserController.handle);
usersRoutes.get('/find', ensureAuthentication, findUserController.handle);
usersRoutes.get('/filter', ensureAuthentication, filterUserController.handle);
usersRoutes.get('/', ensureAuthentication, listUserController.handle);
usersRoutes.put('/', ensureAuthentication, updateUserController.handle);
usersRoutes.get('/profile', ensureAuthentication, profileUserController.handle);
usersRoutes.patch(
  '/avatar',
  ensureAuthentication,
  uploadAvatar.single('avatar'),
  updateUserAvatarController.handle,
);

export { usersRoutes };
