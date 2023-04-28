// Copyright (C) 2018-2023 Intel Corporation
// SPDX-License-Identifier: Apache-2.0
//

/**
 * @file cpu_streams_calculation.hpp
 * @brief A header file for CPU streams calulation implementation.
 */

#pragma once

#include <memory>
#include <vector>

#include "graph.h"
#include "openvino/runtime/properties.hpp"

namespace ov {
namespace intel_cpu {
/**
 * @brief      Generate streams information table according to processors type table.
 * @param[in]  input_streams is the targeted number of streams set by user via ov::num_streams or hints.
 *               - input "0" indicates the optimal number of streams generated by the function.
 *               - When user sets LATENCY hint, OpenVINO runtime generate one stream per CPU node.
 * @param[in]  input_threads is the max number of threads set by user via ov::inference_num_threads.
 *               - input "0" indicates that the function can use all resource in proc_type_table.
 *               - If user limits the max number of threads, the final number of streams output cannot exceed the max
 * number of threads.
 * @param[in]  input_infer_requests is max number of infer requests set by user via ov::hint::num_requests.
 *               - input "0" indicates that the function can use all resource in proc_type_table.
 *               - If user limits the max number of infer requests, the final number of streams output cannot exceed the
 * max number of infer requests.
 * @param[in]  model_prefer_threads is preferred number of threads per stream based on the model generated in previous
 * function.
 *               - input "0" indicates that the function generates the optimal number of threads per stream based on
 * processors type information.
 * @param[in]  proc_type_table is currently available candidate processors.
 *               - candidate processors have benn updated based on user input hints like ov::hint::scheduling_core_type
 * in previous function.
 * @return     streams information table which will be used by StreamsExecutor.
 */
std::vector<std::vector<int>> get_streams_info_table(const int input_streams,
                                                     const int input_threads,
                                                     const int input_infer_requests,
                                                     const int model_prefer_threads,
                                                     const std::vector<std::vector<int>> proc_type_table);
/**
 * @brief      Get model_prefer_threads
 * @param[in]  num_streams is target streams set by user via NUM_STREAMS or hints.
 *               - input "0" mean function generate the optimal number of streams
 *               - LATENCY hint equals 1 stream.
 * @param[in]  proc_type_table candidate processors available at this time
 *               - candidate processors have benn updated based on properties like "Ecore only" in previous function
 * @param[in]  ngraphFunc ngraph function
 * @return     model_prefer_threads "0" means generating the optimal threads per stream based on platform
 */
int get_model_prefer_threads(const int num_streams,
                             const std::vector<std::vector<int>> proc_type_table,
                             const std::shared_ptr<ngraph::Function>& ngraphFunc,
                             const InferenceEngine::IStreamsExecutor::Config streamExecutorConfig);

struct StreamCfg {
    int num_streams;               // Number of streams
    int num_threads;               // Number of threads
    int big_core_streams;          // Number of streams in Performance-core(big core)
    int small_core_streams;        // Number of streams in Efficient-core(small core)
    int threads_per_stream_big;    // Threads per stream in big cores
    int threads_per_stream_small;  // Threads per stream in small cores
    int small_core_offset;
};

/**
 * @brief      Get information about number of streams, threads and pinning threads on different processors
 * @param[in]  streams number of streams
 * @param[in]  ngraphFunc graph handle
 * @param[in]  config intel cpu configuration
 */
void get_num_streams(const int streams,
                     const std::shared_ptr<ngraph::Function>& ngraphFunc,
                     Config& config);

}  // namespace intel_cpu
}  // namespace ov
