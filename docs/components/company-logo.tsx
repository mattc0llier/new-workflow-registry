import Image from 'next/image';

const LOGO_DEV_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_LOGO_DEV_KEY || 'pk_SMpp8LfORtCS4GUlTpAPkw';

interface CompanyLogoProps {
  domain: string;
  name: string;
  size?: number;
  className?: string;
}

export function CompanyLogo({
  domain,
  name,
  size = 48,
  className = '',
}: CompanyLogoProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={`https://img.logo.dev/${domain}?token=${LOGO_DEV_PUBLIC_KEY}`}
        alt={`${name} logo`}
        width={size}
        height={size}
        className="object-contain"
      />
    </div>
  );
}
