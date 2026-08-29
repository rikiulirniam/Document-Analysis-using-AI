export interface SampleDocumentPreset {
  id: string;
  name: string;
  type: 'pdf' | 'docx';
  description: string;
  assignment: string;
  referenceMaterial: string;
  sampleText: string;
}

export const SAMPLE_DOCUMENTS: SampleDocumentPreset[] = [
  {
    id: 'docker-sample',
    name: 'Tugas_Arsitektur_Docker.docx',
    type: 'docx',
    description: 'Student assignment answering Docker mechanisms and container benefits with typos & partial answers.',
    assignment:
      'Jelaskan bagaimana Docker bekerja, apa perbedaan arsitektur antara container dan virtual machine, serta sebutkan minimal 3 manfaat utama containerization dalam pengembangan software modern.',
    referenceMaterial:
      'Docker adalah platform open-source berbasis Linux cgroups dan namespaces. Perbedaan utama dengan VM adalah container berbagi kernel OS host tanpa hypervisor overhead. Manfaat meliputi: 1. Portabilitas lintas environment, 2. Efisiensi resource dan booting cepat, 3. Isolasi dependency aplikasi.',
    sampleText: `LAPORAN TUGAS: PENGENALAN CONTAINER & ARSITEKTUR DOCKER

1. Pendahuluan
Teknologi virtualisasi telah berkembang pesat dalam industri rekayasa perangkat lunak. Salah satu platform yang paling populer saat ini adalah Docker. Docker merupakan platform yang memfasilitasi pengembang untuk mengemas aplikasi beserta pustaka ketergantungannya ke dalam unit mandiri yang disebut container.

2. Cara Kerja Docker
Docker memanfaatkan fitur kernel Linux, yaitu control groups (cgroups) dan namespaces untuk mengisolasi proses. Docker Engine berjalan diatas sistem operasi tuan rumah dan mengelola siklus hidup wadah. Berbeda dengan virtual machine tradisional yang memerlukan sistem operasi tamu (guest OS) lengkap dan hypervisor, container berbagi kernel OS induk sehingga konsumsi memori menjadi sangat ringan.

3. Manfaat Containerization
Penggunaan container memiliki beberapa keuntungan nyata dalam pipeline CI/CD:
- Portabilitas Tinggi: Aplikasi dapat berjalan konsisten di komputer pengembang, server pengujian, maupun cloud production tanpa modifikasi kode (mengatasi masalah "it works on my machine").
- Efisiensi Resource: Booting container hanya memakan waktu beberapa detik karena tidak perlu memuat seluruh kernel OS dari awal.

4. Kesimpulan
Secara keseluruhan, Docker sangat berpengaru besar terhadap percepatan deployment software moderen. Containerization memberikan solusi isolasi yang jauh lebih ringkas dibanding VM.`,
  },
  {
    id: 'ai-ethics-sample',
    name: 'AI_Ethics_and_Governance_Review.pdf',
    type: 'pdf',
    description: 'Essay on ethical considerations of generative AI with subtle grammatical issues and prompt coverage.',
    assignment:
      'Discuss key ethical considerations in deploying generative AI models. Address algorithmic bias, copyright/intellectual property concerns, and accountability mechanisms for autonomous decisions.',
    referenceMaterial:
      'Key ethical pillars include: Fair representation (preventing demographic bias), provenance tracking (content authenticity, watermarking), transparent data consent, and human-in-the-loop oversight for high-risk deployments.',
    sampleText: `ETHICAL IMPLICATIONS OF GENERATIVE ARTIFICIAL INTELLIGENCE

Abstract
The widespread adoption of Large Language Models (LLMs) and diffusion models has revolutionized automated content generation. However, deploying these capabilities in enterprise environments introduces profound ethical challenges that require rigorous organizational governance.

1. Algorithmic Bias and Representational Harms
Generative models inherit statistical correlations present within their training corpora. When unmoderated, models can amplify demographic stereotypes, exhibit gender skew in profession associations, or marginalize under-represented communities. Mitigating this require comprehensive dataset filtering and RLHF alignment.

2. Intellectual Property and Content Attribution
A major point of contention centers on copyright infringment. Training architectures absorb proprietary creative works without explicit consent or compensation mechanisms for original authors. Emergent watermarking techniques and provenance metadata protocols seek to address attribution deficits, though consensus remains elusive.

3. Autonomous Decision Accountability
When generative systems are deployed in advisory roles—such as loan assessments or medical diagnostics—establishing liability when hallucinations occur is critical. Organizations must enforce strict Human-in-the-Loop (HITL) review rather than delegating final decision-making unchecked to probabilistic agents.

Conclusion
Ethical AI governance cannot be treated as an afterthought. Regulatory frameworks must evolve in tandem with technical benchmarks to safeguard individual rights.`,
  },
];
