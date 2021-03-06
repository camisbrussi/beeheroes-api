import { Router } from 'express';
import multer from 'multer';

import { UpdateNewUserAvatarController } from '@modules/accounts/useCases/updateNewUserAvatar/UpdateNewUserAvatarController';

import uploadConfig from '../../../../config/upload';
import { authenticationRoutes } from './authentication.routes';
import { citiesRoutes } from './cities.routes';
import { donationsRoutes } from './donations.routes';
import { evaluationsRoutes } from './evaluation.routes';
import { occupationAreaRoutes } from './occupationArea.routes';
import { organizationsRoutes } from './organizations.routes';
import { organizationTypesRoutes } from './organizationTypes.routes';
import { permissionsRoutes } from './permissions.routes';
import { projectsRoutes } from './projects.routes';
import { rolesRoutes } from './roles.routes';
import { subscriptionsRoutes } from './subscriptions.routes';
import { usersRoutes } from './users.routes';
import { volunteersRoutes } from './volunteers.routes';

const updateNewUserAvatarController = new UpdateNewUserAvatarController();

const router = Router();

const uploadAvatar = multer(uploadConfig);

router.use(authenticationRoutes);
router.use('/permissions', permissionsRoutes);
router.use('/roles', rolesRoutes);
router.use('/users', usersRoutes);
router.use('/organizationtypes', organizationTypesRoutes);
router.use('/organizations', organizationsRoutes);
router.use('/occupationarea', occupationAreaRoutes);
router.use('/volunteers', volunteersRoutes);
router.use('/projects', projectsRoutes);
router.use('/donations', donationsRoutes);
router.use('/subscriptions', subscriptionsRoutes);
router.use('/evaluations', evaluationsRoutes);
router.use('/cities', citiesRoutes);

router.post(
  '/avatar',
  uploadAvatar.single('avatar'),
  updateNewUserAvatarController.handle,
);

export { router };
