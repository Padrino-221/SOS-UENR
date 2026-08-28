import {
  Flask,
  Monitor,
  HardDrives,
  Calculator,
  Leaf,
  Heartbeat,
  Stethoscope,
} from '@phosphor-icons/react/dist/ssr'

const DEPARTMENT_ICONS: Record<string, any> = {
  'chemical-sciences': Flask,
  'computer-science-and-informatics': Monitor,
  'information-technology-and-decision-sciences': HardDrives,
  'mathematics-and-statistics': Calculator,
  'basic-and-applied-biology': Leaf,
  'medical-laboratory-science': Heartbeat,
  'nursing': Stethoscope,
}

const DEFAULT_ICON = Flask

export function getDepartmentIcon(slug: string): any {
  return DEPARTMENT_ICONS[slug] ?? DEFAULT_ICON
}
