import { VM } from 'vm2';

const vm = new VM();

export default {
  run(code) {
    try {
      return {
        status: 'success',
        result: vm.run(code)
      };
    } catch(error) {
      return {
        status: 'error',
        result: error.message
      };
    }
    
  }
};