// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Container Locations',
    path: '/dashboard/container-locations',
    icon: getIcon('el:map-marker'),
  },
  {
    title: 'Garbage Containers',
    path: '/dashboard/garbage-containers',
    icon: getIcon('fluent:bin-full-20-filled'),
  },
  {
    title: 'Rute',
    path: '/dashboard/routing',
    icon: getIcon('majesticons:map-marker-path-line'),
  }
];

export default navConfig;
