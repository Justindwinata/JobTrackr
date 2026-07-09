import logoUrl from "../assets/jobtrackr-logo.svg";

type BrandLogoProps = {
  compact?: boolean;
};

function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <span className={compact ? "brand-logo brand-logo-compact" : "brand-logo"}>
      <img src={logoUrl} alt="JobTrackr" />
    </span>
  );
}

export default BrandLogo;

