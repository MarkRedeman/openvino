#pragma once

#include <iostream>

#include "openvino/openvino.hpp"
#include "./tensor_lite.h"
#include "./shape_lite.h"
#include "./helpers.h"

class Session {
  private:
    ov::CompiledModel model;
  public:
    ShapeLite* shape;
    Session(std::string xml_path, std::string bin_path, ShapeLite* shape, std::string layout);
    TensorLite run(TensorLite* tensor);
};
