import { Box, FileArchive, FileBox, FileCode } from 'lucide-react';

interface RequestFileIconProps {
  fileName?: string;
  className?: string;
}

function getExtension(fileName?: string): string {
  if (!fileName) {
    return '';
  }
  const parts = fileName.toLowerCase().split('.');
  return parts.length > 1 ? (parts.at(-1) ?? '') : '';
}

export function RequestFileIcon({ fileName, className }: RequestFileIconProps) {
  const ext = getExtension(fileName);
  const iconClass = `size-5 shrink-0 text-zinc-400 ${className ?? ''}`;

  if (ext === 'stl') {
    return <Box className={iconClass} aria-hidden="true" />;
  }

  if (ext === 'step' || ext === 'stp') {
    return <FileBox className={iconClass} aria-hidden="true" />;
  }

  if (ext === 'zip' || ext === 'rar' || ext === '7z') {
    return <FileArchive className={iconClass} aria-hidden="true" />;
  }

  return <FileCode className={iconClass} aria-hidden="true" />;
}
