const quit = () => {
  console.log("Thank you! Bye!");
  process.kill(process.pid, "SIGTERM");
};

module.exports = { quit };
