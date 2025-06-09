export function print(...args: any[]) {
  args.forEach((arg) => {
    console.log("DEBUG:", JSON.stringify(arg, null, 2));
  });
}
