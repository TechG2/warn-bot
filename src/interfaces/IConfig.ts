export interface IConfig {
  guildId: string;
  wikiUrl: string;
  staff: {
    staffRoles: string[];
    headRoles: string[];
  };
  verify: {
    linkedRole: string;
    verifiedRole: string;
  };
  tickets: {
    categories: {
      type: number;
      categoryId: string;
      name: string;
      description: string;
      value: string;
      isHeadOnly: boolean;
      questions: {
        id: string;
        question: string;
        style: number;
        maxLength: number;
        required: boolean;
      }[];
    }[];
  };
}
