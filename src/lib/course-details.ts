/* =========================================================================
 * Kurs sahifalari uchun batafsil ma'lumot.
 *
 * Bu yerda FAQAT til-neytral ma'lumotlar (slug, modul kalitlari, texnologiya
 * nomlari, sanoq). Barcha matnlar — messages/{uz,ru,en}.json → CourseDetail.
 *
 * O'quv dasturlari sohaning joriy standartlariga moslab yozilgan
 * (Cisco CCNA 200-301, Linux server/DevOps amaliyoti, Matter/Home Assistant,
 * video-analitika). Modullar ro'yxatini o'zgartirsangiz, messages fayllaridagi
 * mos `modules.<key>` kalitlarini ham yangilang.
 * ========================================================================= */

import type { CourseId } from './courses';

export interface CourseDetail {
  /** URL segmenti: /uz/kurslar/<slug> */
  slug: string;
  /** Modul kalitlari — messages: CourseDetail.<id>.modules.<key> */
  modules: { key: string; topics: string[] }[];
  /** Natija kalitlari — messages: CourseDetail.<id>.outcomes.<key> */
  outcomes: string[];
  /** Kim uchun — messages: CourseDetail.<id>.audience.<key> */
  audience: string[];
  /** Talablar — messages: CourseDetail.<id>.requirements.<key> */
  requirements: string[];
  /** Karyera yo'nalishlari — messages: CourseDetail.<id>.roles.<key> */
  roles: string[];
  /** Kursda ishlatiladigan asboblar (til-neytral) */
  tools: string[];
}

export const COURSE_DETAILS: Partial<Record<CourseId, CourseDetail>> = {
  computer: {
    slug: 'kompyuter-savodxonligi',
    modules: [
      { key: 'basics', topics: ['Windows 11', 'File Explorer', 'OneDrive'] },
      { key: 'internet', topics: ['Chrome', 'Gmail', '2FA'] },
      { key: 'word', topics: ['MS Word', 'Styles', 'PDF'] },
      { key: 'excel', topics: ['MS Excel', 'VLOOKUP', 'Pivot'] },
      { key: 'present', topics: ['PowerPoint', 'Canva', 'PDF'] },
      { key: 'cloud', topics: ['Google Drive', 'Telegram', 'ChatGPT'] },
    ],
    outcomes: ['office', 'excel', 'docs', 'safety', 'ai'],
    audience: ['beginner', 'office', 'entrepreneur'],
    requirements: ['none', 'laptop'],
    roles: ['operator', 'assistant', 'officeWorker'],
    tools: ['Windows 11', 'MS Office 365', 'Google Workspace', 'Telegram', 'AI'],
  },

  cisco: {
    slug: 'cisco-mikrotik-tarmoqlar',
    modules: [
      { key: 'fundamentals', topics: ['OSI', 'TCP/IP', 'Ethernet', 'UTP'] },
      { key: 'addressing', topics: ['IPv4', 'IPv6', 'Subnetting', 'VLSM'] },
      { key: 'switching', topics: ['VLAN', 'Trunk', 'STP', 'EtherChannel'] },
      { key: 'routing', topics: ['Static', 'OSPF', 'Inter-VLAN'] },
      { key: 'services', topics: ['DHCP', 'DNS', 'NAT', 'ACL'] },
      { key: 'mikrotik', topics: ['RouterOS', 'Hotspot', 'Firewall', 'QoS'] },
      { key: 'wireless', topics: ['Wi-Fi', 'WPA3', 'Controller'] },
      { key: 'monitoring', topics: ['Wireshark', 'SNMP', 'Syslog', 'Python'] },
    ],
    outcomes: ['design', 'configure', 'troubleshoot', 'secure', 'ccna'],
    audience: ['starter', 'admin', 'isp'],
    requirements: ['pcBasics', 'english'],
    roles: ['netAdmin', 'noc', 'support'],
    tools: ['Cisco IOS', 'Packet Tracer', 'MikroTik RouterOS', 'Wireshark', 'GNS3'],
  },

  iptelephony: {
    slug: 'ip-telefoniya',
    modules: [
      { key: 'voip', topics: ['VoIP', 'SIP', 'RTP', 'G.711'] },
      { key: 'asterisk', topics: ['Asterisk', 'Dialplan', 'CLI'] },
      { key: 'freepbx', topics: ['FreePBX', 'Trunk', 'Extension'] },
      { key: 'features', topics: ['IVR', 'Queue', 'CDR'] },
      { key: 'quality', topics: ['QoS', 'Jitter', 'NAT traversal'] },
      { key: 'security', topics: ['TLS/SRTP', 'Fail2ban', 'CRM API'] },
    ],
    outcomes: ['deploy', 'dialplan', 'ivr', 'quality', 'integrate'],
    audience: ['netAdmin', 'itSupport', 'callCenter'],
    requirements: ['networkBasics', 'linuxBasics'],
    roles: ['voipEngineer', 'telephonyAdmin', 'integrator'],
    tools: ['Asterisk', 'FreePBX', 'SIP', 'Zoiper', 'Wireshark'],
  },

  security: {
    slug: 'video-nazorat',
    modules: [
      { key: 'basics', topics: ['IP / AHD', 'CMOS', 'Lens'] },
      { key: 'cameras', topics: ['PoE', 'ONVIF', 'RTSP', 'VLAN'] },
      { key: 'storage', topics: ['NVR/DVR', 'RAID', 'HDD'] },
      { key: 'install', topics: ['UTP', 'PoE switch', 'UPS'] },
      { key: 'remote', topics: ['VPN', 'P2P', 'DDNS'] },
      { key: 'analytics', topics: ['Motion', 'Line crossing', 'LPR'] },
    ],
    outcomes: ['design', 'install', 'configure', 'remote', 'analytics'],
    audience: ['installer', 'securityStaff', 'entrepreneur'],
    requirements: ['pcBasics', 'handsOn'],
    roles: ['cctvInstaller', 'securityEngineer', 'serviceOwner'],
    tools: ['Hikvision', 'Dahua', 'ONVIF', 'iVMS', 'SADP'],
  },

  linux: {
    slug: 'linux-administratsiya',
    modules: [
      { key: 'basics', topics: ['Bash', 'grep', 'sed', 'awk'] },
      { key: 'system', topics: ['Users', 'sudo', 'systemd', 'APT/DNF'] },
      { key: 'network', topics: ['ip', 'SSH', 'Firewall', 'Fail2ban'] },
      { key: 'services', topics: ['Nginx', 'MySQL', 'PostgreSQL', "Let's Encrypt"] },
      { key: 'scripting', topics: ['Bash script', 'cron', 'Ansible'] },
      { key: 'docker', topics: ['Docker', 'Compose', 'Volume', 'Registry'] },
      { key: 'ops', topics: ['Git', 'CI/CD', 'Prometheus', 'Grafana'] },
    ],
    outcomes: ['server', 'automate', 'deploy', 'secure', 'monitor'],
    audience: ['itStudent', 'sysadmin', 'devops'],
    requirements: ['pcBasics', 'networkBasics'],
    roles: ['linuxAdmin', 'devopsJunior', 'serverEngineer'],
    tools: ['Ubuntu Server', 'Docker', 'Nginx', 'Git', 'Ansible', 'Grafana'],
  },

  iot: {
    slug: 'aqlli-uy-iot',
    modules: [
      { key: 'electronics', topics: ['GPIO', 'I2C', 'Relay'] },
      { key: 'arduino', topics: ['Arduino', 'ESP32', 'C++', 'Wi-Fi'] },
      { key: 'raspberry', topics: ['Raspberry Pi', 'Linux', 'Python'] },
      { key: 'protocols', topics: ['MQTT', 'Zigbee', 'Matter', 'Wi-Fi'] },
      { key: 'homeassistant', topics: ['Home Assistant', 'YAML', 'Lovelace'] },
      { key: 'project', topics: ['Node-RED', 'Telegram bot', 'Alexa'] },
    ],
    outcomes: ['build', 'program', 'connect', 'automate', 'project'],
    audience: ['hobbyist', 'student', 'installer'],
    requirements: ['pcBasics', 'curiosity'],
    roles: ['iotSpecialist', 'smartHomeIntegrator', 'maker'],
    tools: ['Arduino IDE', 'ESP32', 'Raspberry Pi', 'Home Assistant', 'MQTT', 'Node-RED'],
  },

  /* ----------------------------- AI kurslari ----------------------------
   * Dasturlar 2026-yil holatidagi vositalar bo'yicha: Claude Code
   * (CLAUDE.md, Skills, subagentlar, hooks, MCP, plan mode) va Codex
   * (CLI, IDE kengaytmasi, AGENTS.md, bulutli vazifalar). Vosita
   * yangilanganda modullarni ham yangilang.
   * -------------------------------------------------------------------- */
  aicoding: {
    slug: 'ai-bilan-dasturlash',
    modules: [
      { key: 'foundations', topics: ['LLM', 'Agent', 'Context', 'Token'] },
      { key: 'claudecode', topics: ['CLI', 'Plan mode', 'Git', 'Diff'] },
      { key: 'context', topics: ['CLAUDE.md', 'AGENTS.md', 'Skills', 'Commands'] },
      { key: 'codex', topics: ['Codex CLI', 'VS Code', 'Cloud tasks', 'PR'] },
      { key: 'extend', topics: ['MCP', 'Subagents', 'Hooks', 'Plugins'] },
      { key: 'quality', topics: ['Code review', 'Tests', 'Secrets', 'Sandbox'] },
      { key: 'project', topics: ['Real repo', 'CI/CD', 'Deploy'] },
    ],
    outcomes: ['workflow', 'context', 'review', 'automate', 'ship'],
    audience: ['dev', 'starter', 'itpro'],
    requirements: ['terminal', 'english', 'laptop'],
    roles: ['aiDeveloper', 'automationEngineer', 'freelancer'],
    tools: ['Claude Code', 'Codex CLI', 'VS Code', 'Git', 'GitHub', 'MCP'],
  },

  aiops: {
    slug: 'it-mutaxassisi-uchun-ai',
    modules: [
      { key: 'basics', topics: ['LLM', 'Prompt', 'Limits', 'Privacy'] },
      { key: 'prompt', topics: ['Context', 'Few-shot', 'Checklist'] },
      { key: 'scripts', topics: ['Bash', 'Python', 'Ansible', 'RouterOS'] },
      { key: 'logs', topics: ['Syslog', 'Zabbix', 'Wireshark', 'RCA'] },
      { key: 'docs', topics: ['Runbook', 'Diagram', 'Markdown'] },
      { key: 'automation', topics: ['n8n', 'MCP', 'API', 'Telegram bot'] },
      { key: 'security', topics: ['Data privacy', 'Local LLM', 'Policy'] },
    ],
    outcomes: ['prompt', 'script', 'triage', 'document', 'automate'],
    audience: ['sysadmin', 'netadmin', 'support'],
    requirements: ['itBasics', 'terminal'],
    roles: ['sysadminAi', 'automationEngineer', 'itLead'],
    tools: ['Claude', 'ChatGPT', 'Bash', 'Ansible', 'Zabbix', 'n8n'],
  },

  aibasics: {
    slug: 'suniy-intellekt-asoslari',
    modules: [
      { key: 'intro', topics: ['LLM', 'Chat', 'Model'] },
      { key: 'prompt', topics: ['Prompt', 'Context', 'Examples'] },
      { key: 'text', topics: ['Docs', 'Email', 'Summary'] },
      { key: 'data', topics: ['Excel', 'CSV', 'Charts'] },
      { key: 'media', topics: ['Image', 'Slides', 'Canva'] },
      { key: 'work', topics: ['Search', 'Translate', 'Telegram'] },
      { key: 'safety', topics: ['Privacy', 'Fact-check'] },
    ],
    outcomes: ['tools', 'prompt', 'documents', 'data', 'safety'],
    audience: ['office', 'entrepreneur', 'teacher'],
    requirements: ['pcBasics', 'none'],
    roles: ['officeWorker', 'aiAssistant', 'entrepreneur'],
    tools: ['ChatGPT', 'Claude', 'Gemini', 'MS Office', 'Canva'],
  },
};

/**
 * Batafsil sahifasi bor kurslar — [id, detail] juftliklari.
 * `COURSE_DETAILS` Partial bo'lgani uchun (tayyorlanayotgan kurslarda dastur
 * yo'q) ro'yxatlarni shu yerdan oling: qiymatlar `undefined` bo'lmaydi.
 */
export const COURSE_DETAIL_ENTRIES = Object.entries(COURSE_DETAILS) as [
  CourseId,
  CourseDetail,
][];

/** slug → kurs id (route uchun) */
export const SLUG_TO_ID = Object.fromEntries(
  COURSE_DETAIL_ENTRIES.map(([id, d]) => [d.slug, id])
) as Record<string, CourseId>;

export const COURSE_SLUGS = COURSE_DETAIL_ENTRIES.map(([, d]) => d.slug);

/** Kursning batafsil sahifasi bormi (tayyorlanayotganlarda yo'q) */
export function hasDetail(id: CourseId): boolean {
  return COURSE_DETAILS[id] !== undefined;
}
