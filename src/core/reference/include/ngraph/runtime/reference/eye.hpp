// Copyright (C) 2018-2023 Intel Corporation
// SPDX-License-Identifier: Apache-2.0
//

#pragma once

#include <cmath>

#include "ngraph/shape.hpp"
#include "utils/span.hpp"

namespace ngraph {
namespace runtime {
namespace reference {
template <typename T>
void eye(T* data, const Shape& out_shape, const int64_t diagonal_index) {
    const int64_t num_matrices = shape_size(span(out_shape).subspan(0, out_shape.size() - 2));
    const int64_t num_rows = out_shape[out_shape.size() - 2];
    const int64_t num_columns = out_shape[out_shape.size() - 1];
    const int64_t matrix_size = num_rows * num_columns;

#if defined(__GNUC__) && !defined(__clang__)
#    pragma GCC diagnostic push
#    pragma GCC diagnostic ignored "-Wclass-memaccess"  // to avoid warnings for memset of ov::float16, ov::bfloat16
#endif
    // fill tensor by zero
    std::memset(data, 0, num_matrices * num_columns * num_rows * sizeof(T));
#if defined(__GNUC__) && !defined(__clang__)
#    pragma GCC diagnostic pop
#endif

    // set ones on diagonal
    const int64_t shift_by_columns = std::max(diagonal_index, int64_t(0));
    const int64_t count_by_columns = std::max(num_columns - std::abs(diagonal_index), int64_t(0));
    const int64_t count_by_rows = std::max(num_rows - std::abs(diagonal_index), int64_t(0));
    const int64_t count =
        diagonal_index > 0 ? std::min(count_by_columns, num_rows) : std::min(count_by_rows, num_columns);

    for (auto i = 0; i < num_matrices; i++) {
        for (auto j = 0; j < count; j++) {
            const int64_t index = (j + shift_by_columns - diagonal_index) * num_columns + j + shift_by_columns;
            data[index + i * matrix_size] = static_cast<T>(1);
        }
    }
}
}  // namespace reference
}  // namespace runtime
}  // namespace ngraph
