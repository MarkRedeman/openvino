# Copyright (C) 2018-2023 Intel Corporation
# SPDX-License-Identifier: Apache-2.0

import numpy as np
import pytest
import torch

from pytorch_layer_test_class import PytorchLayerTest

class aten_chunk_2(torch.nn.Module):
    def __init__(self, dim) -> None:
        torch.nn.Module.__init__(self)
        self.dim = dim

    def forward(self, input_tensor):
        a,b = torch.chunk(input_tensor, 
            chunks = 2,
            dim = self.dim
        )
        return a,b

class aten_chunk_3(torch.nn.Module):
    def __init__(self, dim) -> None:
        torch.nn.Module.__init__(self)
        self.dim = dim

    def forward(self, input_tensor):
        a,b,c = torch.chunk(input_tensor, 
            chunks = 3,
            dim = self.dim
        )
        return a,b,c

class aten_chunk_4(torch.nn.Module):
    def __init__(self, dim) -> None:
        torch.nn.Module.__init__(self)
        self.dim = dim

    def forward(self, input_tensor):
        a,b,c,d = torch.chunk(input_tensor, 
            chunks = 4,
            dim = self.dim
        )
        return a,b,c,d

class TestChunk(PytorchLayerTest):
    def _prepare_input(self):
        return (self.input_tensor,)

    @pytest.mark.parametrize("input_tensor", [
        np.random.rand(4, 4),
        np.random.rand(5, 9, 7),
        np.random.rand(10, 13, 11),
        np.random.rand(8, 7, 6, 5, 4),
        np.random.rand(11, 11),
        np.random.rand(7, 7),
    ])
    @pytest.mark.parametrize("chunks", [
        # 1, Does not work for 1 without translate
        2,
        3,
        4
    ])
    @pytest.mark.nightly
    @pytest.mark.precommit
    def test_chunk(self, input_tensor, chunks, ie_device, precision, ir_version):
        self.input_tensor = input_tensor
        
        for dim in range(len(input_tensor.shape)):
            chunk_size = input_tensor.shape[dim] // chunks
            chunk_size += 1 if input_tensor.shape[dim] % chunks > 0 else 0

            output_chunks = input_tensor.shape[dim] // chunk_size
            output_chunks += 1 if input_tensor.shape[dim] % chunk_size > 0 else 0
            
            if output_chunks == 2:
                cls = aten_chunk_2
            elif output_chunks == 3:
                cls = aten_chunk_3
            elif output_chunks == 4:
                cls = aten_chunk_4

            self._test(cls(dim), None, "aten::chunk", 
                    ie_device, precision, ir_version)
