declare global {
  interface Window {
    LOQ?: any[];
  }
}

export const sendLuckyorangeIdentity = (userId: string, params = {}) => {
  window.LOQ = window.LOQ || [];
  window.LOQ.push([
    "ready",
    async (LO: any) => {
      await LO.$internal.ready("visitor");
      LO.visitor.identify(userId, params);
    },
  ]);
};
