var ov = require('bindings')('ov_node_addon');

test('Test for number of arguments in tensor', () => {
    expect(() => new ov.Tensor(ov.element.f32, [1,3,224,224])).toThrow('Invalid number of arguments for Tensor constructor.');
});

describe('Tensor data', () => {
    test('Set tensor data with Float32Array', () => {
        const data = Float32Array.from({length: 150528}, () => Math.random() ); //fill with random data
        var tensor = new ov.Tensor(ov.element.f32, [1,3,224,224], data);
        expect(Float32Array.from(tensor.data)).toEqual(data); // tensor.data returns Float32Array{ "0": 0.7377, "1": 0.4859, (...)}, instead of Float32Array[0.7377, 0.4859, (...)]       
    });

    test('Cannot set tensor data with Float64Array', () => {
        const data = Float64Array.from({length: 150528}, () => Math.random() ); //fill with random data
        
        expect(() => new ov.Tensor(ov.element.f32, [1,3,224,224], data)).toThrow('Third argument of a tensor must be of type Float32Array.');
    });

    test('Set tensor data with Float32Array created from ArrayBuffer', () => {
        var elem_num = 1 * 3 * 224 * 224 ; // =150528 
        var size = elem_num * 4; // =602112
        const buffer = new ArrayBuffer(size);
        const view = new Float32Array(buffer);
        const data = Float32Array.from({length: 150528}, () => Math.random() );
        view.set(data);
        var tensor = new ov.Tensor(ov.element.f32, [1,3,224,224], view);
        expect(Float32Array.from(tensor.data)).toEqual(data); // tensor.data returns Float32Array{ "0": 0.7377, "1": 0.4859, (...)}, instead of Float32Array[0.7377, 0.4859, (...)]       
    });

    test('Set tensor data with too big Float32Array in comparison to shape', () => {
        var elem_num = 1 * 3 * 224 * 224 ; // =150528 
        var size = elem_num * 8; // =602112
        const buffer = new ArrayBuffer(size);
        const view = new Float32Array(buffer);
        const data = Float32Array.from({length: 150528}, () => Math.random() );
        view.set(data);
        expect(() => new ov.Tensor(ov.element.f32, [1,3,224,224], view)).toThrow('Shape and Float32Array size mismatch');
    });

    test('Expect Javascript to throw error when Arraybuffer is too small', () => {
        var elem_num = 1 * 3 * 224 * 224 ; // =150528 
        var size = elem_num * 2; // =602112
        const buffer = new ArrayBuffer(size);
        const view = new Float32Array(buffer);
        const data = Float32Array.from({length: 150528}, () => Math.random() );
        
        expect(() => view.set(data)).toThrow();
    });
      
      
    test('Third argument of a tensor cannot be ArrayBuffer', () => {
        expect(() => new ov.Tensor(ov.element.f32, [1,3,224,224], new ArrayBuffer(1234))).toThrow('Third argument of a tensor must be of type Float32Array.');
    });

    test('Third argument of a tensor cannot be Array object', () => {
        expect(() => new ov.Tensor( ov.element.f32, [1,3,224,224], [1,2,3,4])).toThrow('Third argument of a tensor must be of type Float32Array.');
    });


});


describe('Tensor shape', () => {
    const data = new Float32Array(150528);

    test('ov::Shape from array object', () => {
        var tensor = new ov.Tensor(ov.element.f32, [1,3,224,224], data)
        expect(tensor.get_shape()).toEqual([1,3,224,224])
    });
      
      
    test('ov::Shape from array object with floating point nums', () => {
        var tensor = new ov.Tensor(ov.element.f32, [1, 3.0, 224.8, 224.4], data)
        expect(tensor.get_shape()).toEqual([1, 3, 224, 224])
    });


    test('Array argument to create ov::Shape can only contain numbers', () => {
        expect(() => new ov.Tensor(ov.element.f32, ["1", 3, 224, 224], data)).toThrow('Invalid tensor argument. Passed array must contain only numbers');
    });
    
    
    test('ov::Shape from TypedArray -> Int32Array', () => {
        var tensor = new ov.Tensor(ov.element.f32, Int32Array.from([1, 224, 224, 3]), data);
        expect(tensor.get_shape()).toEqual([1, 224, 224, 3]);
    });
    
    test('Cannot create ov::Shape from Float32Array', () => {
        expect(() => new ov.Tensor(ov.element.f32, Float32Array.from([1, 224, 224, 3]), data)).toThrow(/Invalid tensor argument. Cannot convert argument/);
    });

    test('Cannot create ov::Shape from ArrayBuffer', () => {
        const shape = Int32Array.from([1, 224, 224, 3]);
        expect(() => new ov.Tensor(ov.element.f32, shape.buffer, data)).toThrow(/Invalid tensor argument. Cannot convert argument/);
    });
});

describe('Tensor element type', () => {
    it.each([
        [ov.element.f32, "f32"],
        [ov.element.f64, "f64"],
        [ov.element.i32, "i32"],
        [ov.element.u32, "u32"],
    ])('compares ov.element.%p to string %p', (ov_elem, val) => {
        expect(ov_elem).toEqual(val);
    });
    it.each([
        [ov.element.f32],
        [ov.element.i32],
        [ov.element.u32],
    ])('compares ov.element %p', (ov_elem) => {
        var tensor = new ov.Tensor(ov_elem, Int32Array.from([1, 224, 224, 3]), new Float32Array(150528));
        expect(tensor.get_element_type()).toEqual(ov_elem);
    });
});


