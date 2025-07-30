type ClassValue = string | number | boolean | undefined | null | ClassValue[];

export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}
