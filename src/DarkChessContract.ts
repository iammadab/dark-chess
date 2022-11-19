import {
  state,
  SmartContract,
  Field,
  State,
  Bool,
  Permissions,
  DeployArgs,
} from 'snarkyjs';

export class DarkChessContract extends SmartContract {
  @state(Field) playerOrientationHash = State<Field>();
  @state(Field) playerTurn = State<Bool>();

  deploy(args: DeployArgs) {
    console.log('I got called');
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });
  }
}
