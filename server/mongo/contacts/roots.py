class Seed(object):
	"""docstring for Seed"""
	def __init__(self, arg):
		super(Seed, self).__init__()
		self.arg = arg

class Root(object):
	"""A Root is a seed which """
	def __init__(self, arg):
		super(Root, self).__init__()
		self.arg = arg

class Resource(Seed):
	"""docstring for Resource"""
	def __init__(self, arg):
		super(Resource, self).__init__()
		self.arg = arg
		
class ListResource(Resource):
	"""
	ListResource represents a resource that holds a list of items. ListResources
	can be created dynamically
	"""
	def __init__(self):
		super(ListResource, self).__init__()
		self.isEditable = True
		self.isOrdered = True
		self.provider = None
		
	def getAll(self, iq):
		if self.provider: return self.provider.getAll(iq)
		return []
	
	def getOne(self, iq, id):
		if self.provider: return self.provider.getOne(iq, id)
		return []
	
	def getSome(self, iq, start, count):
		"""docstring for getSome"""
		if self.provider: return self.provider.getSome(iq, start, count)
		return []
	
	def getMany(self, ids):
		if self.provider: return self.provider.getMany(iq, self, ids)
		return []
		
class MongoSeed(ListResource):
	"""docstring for MongoSeed"""
	def __init__(self, arg):
		super(MongoSeed, self).__init__()
		self.arg = arg
		