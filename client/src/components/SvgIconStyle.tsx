
import { Box } from '@mui/material';

// ----------------------------------------------------------------------


export default function SvgIconStyle({ src, sx, color }: { src: string; sx?: any, color?: any }) {
  return (
    <Box
      component="span"
      sx={{
        width: 24,
        height: 24,
        display: 'inline-block',
        bgcolor: 'currentColor',
        mask: `url(${src}) no-repeat center / contain`,
        WebkitMask: `url(${src}) no-repeat center / contain`,
        color,
        ...sx,
      }}
    />
  );
}
