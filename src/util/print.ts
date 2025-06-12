// Imprime os argumentos no console em formato JSON para debug
export function print(...args: any[]) {
  args.forEach((arg) => {
    console.log("DEBUG:", JSON.stringify(arg, null, 2));
  });
}
