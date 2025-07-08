export interface WelcomeBannerProps {
  title: string;
}

export function WelcomeBanner({ title }: WelcomeBannerProps) {
  return <h1 className="text-black text-[32px] font-normal mb-8">{title}</h1>;
}
