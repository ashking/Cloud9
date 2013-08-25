
if (process.env.SM_CLI_CALL !== "true") {
    process.stdout.write("------------------------------------------------------------------------------------------------------------" + "\n");
    process.stdout.write("|  Use the `sm` command from `npm install -g sm` to `sm [install|update|link|...] .` this package/program. |" + "\n");
    process.stdout.write("------------------------------------------------------------------------------------------------------------" + "\n");
}
