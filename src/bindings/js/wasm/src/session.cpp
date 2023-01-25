#include <iostream>
#include <limits.h>

#include "openvino/openvino.hpp"

#include "../include/helpers.h"
#include "../include/session.h"

void printTensor(ov::Tensor t, ov::element::Type type) {
	int size = t.get_size();

	auto data_tensor = reinterpret_cast<float*>(t.data(type)); 

	for (int i = 0; i < size; i++) { 
		std::cout << data_tensor[i] << " ";
	} 
	std::cout << std::endl; 
}

Session::Session(std::string xml_path, std::string bin_path) {
	this->model = loadModel(xml_path, bin_path);
}

uintptr_t Session::run(std::string shape, std::string layout, uintptr_t inputBuffer, int size) {
	ov::CompiledModel compiled_model = compileModel(this->model, shape, layout);

	uint8_t* input_data_array = reinterpret_cast<uint8_t *>(inputBuffer);
	ov::Tensor input_tensor = ov::Tensor(ov::element::u8, shape, input_data_array);
	ov::Tensor output_tensor = performInference(compiled_model, input_tensor);

	printTensor(input_tensor, ov::element::u8);

	int output_tensor_size = output_tensor.get_size();

	std::cout << "== Output tensor size: " << output_tensor_size << std::endl;
	std::cout << "== Float size: " << sizeof(float) * CHAR_BIT << std::endl;
	std::cout << "== Tensor output: " << std::endl;

	auto data_tensor = reinterpret_cast<float*>(output_tensor.data(ov::element::f32)); 
	float values[output_tensor_size];

	for (int i = 0; i < output_tensor_size; i++) { 
		values[i] = data_tensor[i];
	}

	return uintptr_t(&values[0]);
}
