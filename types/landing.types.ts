export interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface ServiceStatus {
  name: string;
  status: "online" | "down";
  color: "green" | "red";
}
