import { format, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date: any) {
  return format(new Date(date), 'dd MMMM yyyy');
}

export function fDateTime(date: any) {
  return format(new Date(date), 'dd MMM yyyy HH:mm');
}

export function fDateTimeSuffix(date: any) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date: any) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}
