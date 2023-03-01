// Copyright (C) 2018-2023 Intel Corporation
// SPDX-License-Identifier: Apache-2.0
//

#pragma once

#include "openvino/openvino.hpp"

std::shared_ptr<ov::Model> loadModel(std::string xml_path, std::string bin_path);

ov::CompiledModel compileModel(std::shared_ptr<ov::Model> model, ov::Shape shape, std::string layout);

ov::Tensor performInference(ov::CompiledModel cm, ov::Tensor t);

ov::Tensor getRandomTensor();
