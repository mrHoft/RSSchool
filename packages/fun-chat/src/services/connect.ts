import { cloneDeep, isEqual } from '~/utils/utils';
import Construct from './construct';
import state from './state';

export default function connect(
  construct: typeof Construct,
  mapStateToProps: (obj: Indexed) => Indexed,
) {
  return class extends construct {
    constructor(tag: keyof HTMLElementTagNameMap, props: Indexed = {}) {
      let oldState: Indexed | undefined = mapStateToProps(state.getState());
      super(tag, { ...props, state: { ...oldState } });

      state.on(state.EVENT_UPDATE, () => {
        const newState = mapStateToProps(state.getState());
        if (!newState || !oldState || !isEqual(oldState, newState)) {
          if (newState) {
            oldState = <Indexed>cloneDeep(newState);
            this.setProps({ state: { ...newState } });
          } else {
            oldState = undefined;
            this.setProps({ state: undefined });
          }
        }
      });
    }
  };
}
