import { program } from 'commander';
interface HelpModel {
  help?: boolean;
}
class Helper {
  protected print() {
    console.log('this is help com');
  }
  protected help() {
    const { help } = program.opts<HelpModel>();
    if (help) {
      this.print();
      this.exit();
    }
  }
  protected exit() {
    process.exit(0);
  }
}

export default Helper;
